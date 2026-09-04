const HEIGHT = 20;


export const handleScroll = (e, hasNext, isFetching, fetchHandler) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + HEIGHT) {
        if (hasNext && !isFetching) {
            fetchHandler();
        }
    }
}