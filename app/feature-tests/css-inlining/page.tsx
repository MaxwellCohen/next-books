import styles from './page.module.css';

// experimental.inlineCss: true in next.config.ts inlines this route's CSS as <style>.
export default function CssInliningPage() {
  return (
    <div className="px-6 py-5">
      <h1 className="text-xl font-semibold">css-inlining</h1>
      <p className={styles.ftInlineMarker} data-testid="marker">
        Styled by a route-scoped CSS module (outline rgb(1, 2, 3)).
      </p>
    </div>
  );
}
