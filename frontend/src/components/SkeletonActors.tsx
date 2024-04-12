import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonActors() {
    return (
        <SkeletonTheme baseColor="#242531" highlightColor="#8d7cdd1a">
            {Array(40)
                .fill(null)
                .map((_, index) => (
                    <Skeleton key={index} height={58} borderRadius={12} />
                ))}
        </SkeletonTheme>
    );
}

export default SkeletonActors;
