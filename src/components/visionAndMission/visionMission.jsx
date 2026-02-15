import css from "./visionMission.module.css";

export default function VisionMission() {
  return (
      <>
          <section className={css.visionMissionContainer}>
              <div className={css.VisionMissionContent}>
                  <h2 className={css.title}>Vizyonumuz ve Misyonumuz</h2>
                    <p className={css.description}>açıklama burada yazacak</p>
              </div>
              <div className={css.VisionMissionContent}>
                  <h2 className={css.title}>Neden Bizi Seçmelisiniz?</h2>
                    <p className={css.description}>açıklama burada yazacak</p>
              </div>
          </section>
        </>
    );
}