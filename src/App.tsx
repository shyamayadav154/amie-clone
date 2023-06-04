import { stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Avaibility, Colors, Music, Team, Todo } from "./features/cards";
import { useFeatureStore } from "./features/store";
import { MusicVisual, OtherVisual } from "./features/visual";
import { useHidePageOverflow } from "./hooks/use-hide-scroll";
import { useEscapePress } from "./hooks/use-escape";

function App() {
    const [scope, animate] = useAnimate();
    const inFullScreen = useFeatureStore((state) => state.inFullScreen);
    const lastFullScreen = useFeatureStore((state) => state.lastFullScreen);
    const setInFullScreen = useFeatureStore((state) => state.setInFullScreen);
    const onEscapePress = () => {
        if (inFullScreen) {
            setInFullScreen(null);
        }
    };
    useHidePageOverflow(!!inFullScreen);
    useEscapePress(onEscapePress);

    useEffect(() => {
        if (inFullScreen) {
            animate([
                [
                    ".title",
                    { opacity: 0, x: "-200px" },
                    { duration: 0.3, delay: stagger(0.05) },
                ],
                [
                    `.visual-${inFullScreen}`,
                    { opacity: 1, scale: 1, pointerEvents: "auto" },
                    { at: "<" },
                ],
                [
                    ".active-card .gradient",
                    { opacity: 0, scale: 0, y: -100, x: 100 },
                    { at: "<" },
                ],
                [".active-card .show-me-btn", { opacity: 0 }, { at: "<" }],
                [".back-to-site", { opacity: 1, y: "0px" }, { at: "<", duration: 0.3 }],
            ]);
        } else {
            animate([
                [
                    ".title",
                    { opacity: 1, x: "0px" },
                    { duration: 0.3, delay: stagger(0.05) },
                ],
                [
                    `.visual-${lastFullScreen}`,
                    { opacity: 0, scale: 0.75, pointerEvents: "none" },
                    { at: "<" },
                ],
                [
                    ".active-card .gradient",
                    { opacity: 1, scale: 1, y: 0, x: 0 },
                    { at: "<" },
                ],
                [".back-to-site", { opacity: 0, y: "300px" }, {
                    at: "<",
                    duration: 0.3,
                }],
                [".active-card .show-me-btn", { opacity: 1 }],
            ]);
        }
    }, [inFullScreen, animate, lastFullScreen]);
    return (
        <main className="mx-auto max-w-5xl px-4">
            <HeroSection />
            <section ref={scope}>
                <article>
                    {features.map((feature) => (
                        <feature.visual key={feature.id} id={feature.id} />
                    ))}

                    <button
                        onClick={() => {
                            setInFullScreen(null);
                        }}
                        className="bg-black  font-medium z-10 back-to-site px-4 py-2 text-white fixed -translate-x-1/2 bottom-5 rounded-xl opacity-0 left-1/2"
                    >
                        Back to site
                    </button>
                </article>
                <FeatureSection />
            </section>
        </main>
    );
}

function HeroSection() {
    return (
        <section className="py-20 ">
            <h1 className="text-6xl font-bold">
                The joyful productivity app.
                <br />
                <span className="text-gray-500">
                    Schedule time for todos, events,
                </span>
                <br />
                <span className="text-gray-500 font-bold ">and contacts.</span>
            </h1>
            <article className="aspect-[16/9] h-64 rounded-xl mt-10 bg-black" />
        </section>
    );
}

const FeatureSection = () => {
    return (
        <section className="flex w-full items-start gap-20">
            <article className="w-full py-[50vh]">
                <ul className="">
                    {features.map((feature) => (
                        <FeatureTitle key={feature.id} feature={feature} />
                    ))}
                </ul>
            </article>
            <article className="w-full sticky flex h-screen items-center top-0">
                <div className="aspect-square relative [&:has(>_.active-card)]:bg-transparent  bg-gray-100 h-[400px]  rounded-3xl">
                    {features.map((feature) => (
                        <feature.card id={feature.id} key={feature.id} />
                    ))}
                </div>
            </article>
        </section>
    );
};

type FeatureTitleProps = {
    feature: (typeof features)[0];
};

const FeatureTitle = ({ feature }: FeatureTitleProps) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, {
        margin: "-50% 0px -50% 0px",
    });

    const setInViewFeature = useFeatureStore((state) => state.setInViewFeature);
    const inViewFeature = useFeatureStore((state) => state.inViewFeauture);

    useEffect(() => {
        if (isInView) {
            setInViewFeature(feature.id);
        }
        if (!isInView && inViewFeature === feature.id) {
            setInViewFeature(null);
        }
    }, [isInView, setInViewFeature, inViewFeature, feature?.id]);

    return (
        <p
            ref={ref}
            className={`text-4xl title transition-colors duration-300 ${isInView ? "text-black" : "text-gray-300 "
                } py-16 font-bold`}
        >
            {feature.title}
        </p>
    );
};

const features = [
    {
        title: "Use your calendar as a todo list",
        id: "todo-list",
        card: Todo,
        visual: OtherVisual,
    },
    {
        title: "Color your calendar to organize",
        id: "colors",
        card: Colors,
        visual: OtherVisual,
    },
    {
        title: "Instantly know if someone is available",
        id: "availability",
        card: Avaibility,
        visual: OtherVisual,
    },
    {
        title: "Track what you listened to when",
        id: "music",
        card: Music,
        visual: MusicVisual,
    },

    {
        title: "Always know what your team is up to",
        id: "team",
        card: Team,
        visual: OtherVisual,
    },
];
export default App;
