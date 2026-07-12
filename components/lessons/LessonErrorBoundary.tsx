"use client";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; onExit: () => void; }
interface State { failed: boolean; }
export class LessonErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch() { /* The child-facing recovery UI is intentional; no learner data is transmitted. */ }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="lesson-error" role="alert"><div><span aria-hidden="true">🛟</span><p className="section-kicker">任务舱暂停</p><h1>这一课刚才遇到了小故障</h1><p>你的已完成课程和徽章还在。先回地图，稍后可以重新进入这课。</p><button className="primary-action" onClick={this.props.onExit} type="button">安全返回课程地图</button></div></main>;
  }
}
