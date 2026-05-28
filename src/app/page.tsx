import { MainPageSection, MainSection, ReviewsSection } from "@/components";

export default function Home() {
  return (
    <div className="flex-col gap-0 w-full">
      <MainSection />
      
      <MainPageSection imageSrc="/newdash.png" header="Почніть вимірювати ⏱" 
      textFirst="Використовуйте трекінг, щоб розуміти, скільки вже прочитали і скільки часу ще потрібно, щоб дочитати почату книгу."
      textSecond="Відслідковуйте свій прогрес."/>
      
      <MainPageSection imageSrc="/second-section.png" header="Читайте регулярно ⛵"
      textFirst="Тепер ви бачите коли читаєте."
      textSecond="Це круто — читати хоча б хвилину на день :)" backgroundColor="#FFCC90"
      />
      
      <MainPageSection imageSrc="/third-section.png" header="Конспектуйте ⛲"
      textFirst="Прочитане забувається?"
      textSecond="Нотатки, цитати, хороші ідеї або summary тепер завжди в застосунку Rork."
      />

      <MainPageSection imageSrc="/fourth-section.png" header="Надихайтеся ✈️"
      textFirst="Показуйте свій приклад друзям та майте можливість подивитися, чи читали вони сьогодні."
      textSecond="Ми поважаємо приватність, і якщо ваша книга є особистою — назва, автор та обкладинка будуть приховані від інших в один клік."
      backgroundColor="#f6f6f6"
      />

      <MainPageSection imageSrc="/fifth-section.png" header="Колекціонуйте ✨"
      textFirst="Створюйте стільки списків та колекцій, скільки потрібно."
      textSecond="Наприклад, зберіть колекцію книг, які бажаєте прочитати цього року."
      />

      <ReviewsSection />
    </div>
  );
}
