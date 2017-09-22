export function isSlugMap(other) {
    return ('object' === typeof other && Object.keys(other).every(function (k) { return 'string' === typeof k; }));
}
export function isChapterConfig(other) {
    return ('cuid' in other
        &&
            'slug' in other
        &&
            isSlugMap(other.slug));
}
export function isLocalizedChapter(other) {
    return ('cuid' in other
        &&
            ('slug' in other && 'string' === typeof other.slug)
        &&
            'locale' in other);
}
//# sourceMappingURL=typechecks.js.map