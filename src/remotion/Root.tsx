import { registerRoot } from 'remotion';
import { CourseVideo } from './CourseVideo';

registerRoot(() => {
    return <CourseVideo lessons={[]} />;
});
