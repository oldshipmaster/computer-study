import { Bibi } from "@/components/Bibi";
import {
  ISLANDS,
  getCourse,
  getCourseCardState,
  type Course,
  type CourseCardState,
} from "@/lib/course-data";

interface IslandMapProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const FIRST_COURSE_ID = "keyboard-flight";

const DIFFICULTY_LABELS: Record<Course["difficulty"], string> = {
  1: "轻松",
  2: "进阶",
  3: "挑战",
};

interface CourseCardProps {
  course: Course;
  state: CourseCardState;
  onStartCourse: (courseId: string) => void;
}

function CourseCard({ course, state, onStartCourse }: CourseCardProps) {
  const available = course.playable;
  const completed = state === "completed";
  const status = completed ? "已完成" : state === "available" ? "开始任务" : "即将开放";

  return (
    <li className="course-card-wrap">
      <button
        className={`course-card ${completed ? "course-card--complete" : ""} ${
          available ? "course-card--available" : "course-card--locked"
        }`}
        data-course-card
        data-course-id={course.id}
        disabled={!available}
        onClick={available ? () => onStartCourse(course.id) : undefined}
        type="button"
      >
        <span className="course-card-topline">
          <span className="course-number">第 {String(course.order).padStart(2, "0")} 课</span>
          <span className="course-status">{status}</span>
        </span>
        <span className="course-card-copy">
          <strong>{course.title}</strong>
          <span>{course.summary}</span>
        </span>
        <span className="course-card-meta">
          <span>{course.skill}</span>
          <span>{course.minutes} 分钟</span>
          <span>{DIFFICULTY_LABELS[course.difficulty]}</span>
        </span>
      </button>
    </li>
  );
}

export function IslandMap({
  completedCourseIds,
  onStartCourse,
}: IslandMapProps) {
  const firstCourse = getCourse(FIRST_COURSE_ID);

  return (
    <main className="island-app-shell">
      <header className="site-header" aria-label="比特岛导航">
        <a className="brand-mark" href="#adventure-map" aria-label="比特岛大冒险课程地图">
          <span className="brand-orbit" aria-hidden="true">
            B
          </span>
          <span>比特岛大冒险</span>
        </a>
        <span className="island-count">四座知识岛等你探索</span>
      </header>

      <section className="map-hero" aria-labelledby="map-heading">
        <div className="hero-copy">
          <p className="hero-kicker">今天的探险任务</p>
          <h1 id="map-heading">跟比比一起，学会真正的电脑本领</h1>
          <p className="hero-summary">
            每次用 9 分钟完成一个小任务，从键盘驾驶一直探索到安全灯塔。
          </p>

          {firstCourse ? (
            <div className="current-mission" aria-label="当前任务">
              <span className="mission-label">当前任务</span>
              <div>
                <strong>{firstCourse.title}</strong>
                <span>{firstCourse.summary}</span>
              </div>
              <button
                className="primary-action"
                onClick={() => onStartCourse(firstCourse.id)}
                type="button"
              >
                继续冒险
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="hero-world" aria-label="比比在启航港等你">
          <div className="hero-sun" aria-hidden="true" />
          <div className="hero-cloud hero-cloud--one" aria-hidden="true" />
          <div className="hero-cloud hero-cloud--two" aria-hidden="true" />
          <div className="launch-island" aria-hidden="true">
            <span className="launch-island-palm" />
            <span className="launch-island-ship">▲</span>
          </div>
          <Bibi mood="happy" message="我是比比！今天先从启航港学会驾驶飞船。" />
        </div>
      </section>

      <section className="adventure-map" id="adventure-map" aria-labelledby="islands-heading">
        <div className="map-intro">
          <div>
            <p className="section-kicker">你的学习航线</p>
            <h2 id="islands-heading">四座岛，二十次真本领练习</h2>
          </div>
          <p>从第一座岛出发。学会一项本领，航线就会向前亮起一段。</p>
        </div>

        <div className="map-route">
          {ISLANDS.map((island, islandIndex) => {
            const islandCourses = island.courseIds
              .map((courseId) => getCourse(courseId))
              .filter((course): course is Course => Boolean(course));
            const completedCount = island.courseIds.filter((courseId) =>
              completedCourseIds.includes(courseId),
            ).length;

            return (
              <div className="map-leg" key={island.id}>
                {islandIndex > 0 ? (
                  <div className={`route-curve route-curve--${islandIndex}`} aria-hidden="true">
                    <span />
                  </div>
                ) : null}
                <section
                  className="island-section"
                  data-accent={island.accent}
                  aria-labelledby={`${island.id}-heading`}
                >
                  <div className="island-heading-row">
                    <div className="island-title-group">
                      <span className="island-icon" aria-hidden="true">
                        {island.icon}
                      </span>
                      <div>
                        <span className="island-stage">航线 {islandIndex + 1}</span>
                        <h3 id={`${island.id}-heading`}>{island.name}</h3>
                        <p>{island.subtitle}</p>
                      </div>
                    </div>
                    <span className="island-progress">
                      <strong>{completedCount}</strong> / {island.courseIds.length} 完成
                    </span>
                  </div>

                  <ol className="course-grid">
                    {islandCourses.map((course) => (
                      <CourseCard
                        course={course}
                        key={course.id}
                        onStartCourse={onStartCourse}
                        state={getCourseCardState(course, completedCourseIds)}
                      />
                    ))}
                  </ol>
                </section>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="map-footer">
        <span aria-hidden="true">★</span>
        <p>完成一课后记得离开屏幕，看看远处，让眼睛休息一会儿。</p>
      </footer>
    </main>
  );
}
