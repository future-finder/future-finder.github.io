// Native module: Pagefind is generated after the static build, and loaded on demand.
let searchController;
const bindSearch = () => {
    searchController?.abort();
    searchController = new AbortController();
    const { signal } = searchController;
    const dialog = document.querySelector('[data-search-dialog]');
    const input = dialog?.querySelector('[data-search-input]');
    const results = dialog?.querySelector('[data-search-results]');
    const hint = dialog?.querySelector('[data-search-hint]');
    if (!dialog || !input || !results || !hint)
        return;
    let pagefind;
    let timer;
    const open = () => { dialog.showModal(); setTimeout(() => input.focus(), 30); };
    const close = () => { dialog.close(); input.value = ''; results.innerHTML = ''; hint.hidden = false; };
    document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', open, { signal }));
    dialog.querySelector('[data-search-close]')?.addEventListener('click', close, { signal });
    dialog.addEventListener('click', (event) => { if (event.target === dialog)
        close(); }, { signal });
    addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dialog.open) {
            event.preventDefault();
            close();
            return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            dialog.open ? close() : open();
        }
    }, { signal, capture: true });
    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = window.setTimeout(async () => {
            const query = input.value.trim();
            if (!query) {
                results.innerHTML = '';
                hint.hidden = false;
                return;
            }
            hint.hidden = true;
            results.replaceChildren();
            const loading = document.createElement('p');
            loading.className = 'search-loading';
            loading.textContent = '正在搜索…';
            results.append(loading);
            try {
                if (!pagefind) {
                    const base = dialog.dataset.searchBase || '/';
                    const modulePath = new URL('pagefind/pagefind.js', new URL(base, window.location.origin)).href;
                    pagefind = await import(/* @vite-ignore */ modulePath);
                    await pagefind.init();
                }
                const search = await pagefind.search(query);
                const data = await Promise.all(search.results.slice(0, 8).map((item) => item.data()));
                if (signal.aborted || input.value.trim() !== query)
                    return;
                results.replaceChildren();
                if (data.length) {
                    data.forEach((item) => {
                        const link = document.createElement('a');
                        link.className = 'search-result';
                        link.href = item.url;
                        const title = document.createElement('span');
                        title.textContent = item.meta?.title || '未命名内容';
                        const excerpt = document.createElement('p');
                        excerpt.textContent = String(item.excerpt || item.meta?.description || '').replace(/<[^>]+>/g, '');
                        link.append(title, excerpt);
                        results.append(link);
                    });
                }
                else {
                    const empty = document.createElement('p');
                    empty.className = 'search-loading';
                    empty.textContent = '没有找到相关内容。';
                    results.append(empty);
                }
            }
            catch {
                results.replaceChildren();
                const error = document.createElement('p');
                error.className = 'search-loading';
                error.textContent = '搜索暂不可用，请稍后重试。';
                results.append(error);
            }
        }, 180);
    }, { signal });
    signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
};
bindSearch();
document.addEventListener('astro:page-load', bindSearch);
