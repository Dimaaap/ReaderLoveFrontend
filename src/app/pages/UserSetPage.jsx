"use client"

import { MePageTabs, Sidebar } from "@/components";
import { withAuth } from "@/components/WithAuth"
import { useAuth } from "@/hooks/useAuth";
import { AllLinks, fetcher } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookOpen, ChevronDown, ChevronRight, MessageSquare, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookSelectPopup } from "@/components/modals/BookSelectPopup";
import { useState } from "react";
import { BuyBookModal } from "@/components/modals/BuyBookModal";
import { getBookDeclension } from "@/utils/declension"

const bookStatusConverterMap = {
    "want_to_read": "Хочу прочитати",
    "reading": "Читаю зараз",
    "finished": "Прочитано",
    "paused": "На паузі",
    "abandoned": "Закинуто"
}

function SetContent() {
    const { user } = useAuth()
    const queryClient = useQueryClient();
    const pathname = usePathname();

    const selectionSlug = pathname.split('/')[3]

    const [activeTab, setActiveTab] = useState("Добірки");
    const [selectedBookForStatus, setSelectedBookForStatus] = useState(null);
    const [selectedBookForBuy, setSelectedBookForBuy] = useState(null);

    const { data: selection, isLoading, isError, error } = useQuery({
      queryKey: ["book-selection", selectionSlug, user?.username],
      queryFn: () => fetcher(AllLinks.bookSelections.BOOK_SELECTION_BY_IDENTIFIER(selectionSlug, user?.username)),
      enabled: !!selectionSlug && !!user?.username,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    })
    
    const updateStatusMutation = useMutation({
        mutationFn: async ({ bookSlug, status }) => {
            return await fetcher(AllLinks.books.UPDATE_USER_BOOK_READING_STATUS(user.username, bookSlug), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: status, last_read_page: 0 })
            })
        },
        onSuccess: (_, variables) => {
            queryClient.setQueryData(
                ["book-selection", selectionSlug, user?.username],
                (oldData) => {
                    if (!oldData || !oldData.books) return oldData;

                    return {
                        ...oldData,
                        books: oldData.books.map((b) =>
                            b.slug === variables.bookSlug
                                ? { ...b, user_read_status: variables.status }
                                : b
                        )
                    };
                }
            );
            setSelectedBookForStatus(null);
        }
    });

    const deleteStatusMutation = useMutation({
        mutationFn: async ({ bookSlug }) => {
            return await fetcher(AllLinks.books.DELETE_BOOK_STATUS(user.username, bookSlug), {
                method: "DELETE"
            })
        },
        onSuccess: (_, variables) => {
            queryClient.setQueryData(
                ["book-selection", selectionSlug, user?.username],
                (oldData) => {
                    if (!oldData || !oldData.books) return oldData;

                    return {
                        ...oldData,
                        books: oldData.books.map((b) =>
                            b.slug === variables.bookSlug
                                ? { ...b, user_read_status: null }
                                : b
                        )
                    };
                }
            );
            queryClient.invalidateQueries({ queryKey: ["book-selection", selectionSlug, user?.username] });
            setSelectedBookForStatus(null);
        },
        onError: (err) => {
            console.error("Помилка при видаленні статусу:", err);
        }
    });

    const handleSaveStatus = (newStatus, targetBook = null) => {
        const bookToUpdate = targetBook || selectedBookForStatus;
        if (!bookToUpdate) return;

        if (newStatus === null || newStatus === undefined) {
            deleteStatusMutation.mutate({ bookSlug: bookToUpdate.slug });
        } else {
            updateStatusMutation.mutate({
                bookSlug: bookToUpdate.slug,
                status: newStatus
            });
        }
    }

    const booksCount = selection?.books?.length ?? 0;

    return (
        <div className="flex items-start w-full bg-[#0D0B0C] min-h-screen overflow-y-auto">
            <Sidebar username={ user?.username } />

            <main className="flex-1 p-8 max-w-5xl mx-auto mb-[5%]">
                <MePageTabs setter={ setActiveTab } activeTab={ activeTab } />

                { isLoading && (
                    <div className="mt-8 space-y-6 animate-pulse">
                        <div className="w-full h-72 bg-zinc-900 rounded-2xl border border-zinc-800/60" />
                        <div className="h-8 w-48 bg-zinc-900 rounded-lg" />

                        <div className="space-y-4">
                            <div className="w-full h-44 bg-zinc-900 rounded-xl border border-zinc-800/60" />
                            <div className="w-full h-44 bg-zinc-900 rounded-xl border border-zinc-800/60" />
                        </div>
                    </div>
                ) }

                { isError && (
                    <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        Не вдалось завантажити добірку. { error?.message || "Спробуйте пізніше." }
                    </div>
                ) }

                { !isLoading && !isError && selection && (
                    <div className="mt-8 space-y-8">
                        <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-2xl">
                            { selection.cover_image && (
                                <div className="absolute inset-0 z-0">
                                    <Image 
                                        src={ selection.cover_image }
                                        alt={ selection.title || "Обкладинка" }
                                        fill
                                        className="object-cover opacity-25 filter scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#0D0B0C] via-[#0D0B0C]/80 to-transparent" />
                                </div>
                            ) }

                            <div className="relative z-10 p-6 md:p-8 space-y-4">
                                <span className="inline-block px-3 py-1 text-xs font-medium bg-zinc-800/80 text-zinc-300 rounded-full border border-zinc-700/50 backdrop-blur-sm">
                                    { selection.author_name }
                                </span>

                                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                                    { selection.title }
                                </h2>

                                <div className="flex items-center gap-2 text-amber-400/90 text-sm font-medium">
                                    <BookOpen className="w-4 h-4" />
                                    <span>
                                        { booksCount } { getBookDeclension(booksCount) }
                                    </span>
                                </div>

                                { selection.description && (
                                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-4xl pt-2">
                                        { selection.description }
                                    </p>
                                ) }
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white">
                                { booksCount } { getBookDeclension(booksCount) } у добірці
                            </h3>
                        </div>

                        <div className="space-y-4">
                            { booksCount > 0 ? (
                                selection.books.map((book, index) => {
                                    const isUpdatingThisBook = updateStatusMutation.isPending && updateStatusMutation.variables?.bookSlug === book.slug;
                                    const isDeletingThisBook = deleteStatusMutation.isPending && deleteStatusMutation.variables?.bookSlug === book.slug;
                                    const isBookLoading = isUpdatingThisBook || isDeletingThisBook;
                                    
                                    const isAdded = !!book.user_read_status;

                                    return (
                                        <div
                                            key={ book.id || index }
                                            className="block bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 md:p-6 transition-all hover:border-zinc-700/80 shadow-lg"
                                        >
                                            <div className="flex gap-5 items-start">
                                                <span className="text-sm font-bold text-zinc-500 min-w-5 pt-1">
                                                    { index + 1 }
                                                </span>
                                                <Link 
                                                    className="relative w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/40 shadow-md" 
                                                    href={`/book/${book.slug}`}
                                                >
                                                    { book.image_link ? (
                                                        <Image
                                                            src={ book.image_link }
                                                            alt={ book.title || "Обкладинка" }
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center p-2 text-zinc-600 text-xs text-center">
                                                            Немає обкладинки
                                                        </div>
                                                    ) }
                                                </Link>

                                                <div className="flex-1 flex flex-col items-start gap-3">
                                                    <div>
                                                        <Link href={`/book/${book.slug}`}>
                                                            <h4 className="text-lg font-bold text-white hover:text-amber-400 transition-colors">
                                                                { book.title }
                                                            </h4>
                                                        </Link>
                                                        <p className="text-sm text-zinc-400 mt-0.5">
                                                            { book.authors?.[0] ? `${book.authors[0].first_name} ${book.authors[0].last_name}` : "Автор не вказаний" }
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        { book.min_price && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedBookForBuy(book)}
                                                                className="flex items-center gap-2 px-3 py-1.5 border border-amber-500/40 bg-amber-500/10 rounded-xl text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all cursor-pointer"
                                                            >
                                                                <span>Від { book.min_price } грн</span>
                                                                <span className="text-amber-500/40">|</span>
                                                                <span className="flex items-center">
                                                                    Купити <ChevronRight className="w-3 h-3 ml-0.5" />
                                                                </span>
                                                            </button>
                                                        ) }

                                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-800/60 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                                                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                                                            <span>{ book.reviews_count ?? 0 } відгуків</span>
                                                        </div>
                                                    </div>

                                                    <button 
                                                        type="button"
                                                        disabled={ isBookLoading }
                                                        onClick={() => {
                                                            if (!book.user_read_status) {
                                                                handleSaveStatus("want_to_read", book);
                                                            } else {
                                                                setSelectedBookForStatus(book);
                                                            }
                                                        }}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                                                            isAdded 
                                                                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20" 
                                                                : "bg-zinc-800 border-zinc-700/80 text-white hover:bg-zinc-700"
                                                        }`}
                                                    >
                                                        { isBookLoading ? (
                                                            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                                                        ) : isAdded ? (
                                                            <Check className="w-3.5 h-3.5 text-amber-400" />
                                                        ) : (
                                                            <Bookmark className="w-3.5 h-3.5 text-zinc-400 fill-amber-400/20" />
                                                        ) }
                                                        
                                                        <span>{ bookStatusConverterMap[book.user_read_status] || "Хочу прочитати" }</span>
                                                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-zinc-500 text-sm italic">
                                    У цій добірці поки немає книг
                                </p>
                            ) }
                        </div>
                    </div>
                ) }
            </main>

            <BookSelectPopup 
                isOpen={ !!selectedBookForStatus } 
                onClose={ () => setSelectedBookForStatus(null) }
                currentStatus={ selectedBookForStatus?.user_read_status }
                onSave={ (status) => handleSaveStatus(status) }
                isPending={ updateStatusMutation.isPending || deleteStatusMutation.isPending }
            />

            <BuyBookModal
                isOpen={ !!selectedBookForBuy }
                onClose={ () => setSelectedBookForBuy(null) }
                book={ selectedBookForBuy }
            />
        </div>
    )
}

const ProtectedPage = withAuth(SetContent);

export default function UserSetPage() {
    return <ProtectedPage />
}