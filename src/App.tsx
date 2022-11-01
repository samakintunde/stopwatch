import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

interface TimeUnitDisplayProps {
    time: number;
    unit: string;
}

const TimeUnitDisplay: React.FC<TimeUnitDisplayProps> = ({ time, unit }) => {
    const classes = clsx({
        "text-5xl md:text-9xl font-extrabold transition-colors duration-500 relative":
            true,
        "text-indigo-300": time === 0,
        "text-indigo-500": time > 0,
    });

    return <div className={classes}>{padDigits(time)}</div>;
};

function App() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const convertMsToTime = (milliseconds: number) => {
        const ms = Math.floor(milliseconds / 20);
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);

        return {
            minutes,
            seconds: seconds % 60,
            milliseconds: ms % 100,
        };
    };

    const toggleRunningState = () => {
        setIsRunning((prevState) => !prevState);
    };

    useEffect(() => {
        let interval: number;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevState) => prevState + 20);
            }, 20);
        }

        return () => {
            clearInterval(interval);
            if (isRunning) {
                setTime(0);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        const bindToggleToSpaceKey = (event: KeyboardEvent) => {
            event.preventDefault();
            if (event.code !== "Space") return;
            toggleRunningState();
        };

        document.body.addEventListener("keyup", bindToggleToSpaceKey);

        return () => {
            document.body.removeEventListener("keyup", bindToggleToSpaceKey);
        };
    }, []);

    const processedTime = convertMsToTime(time);

    return (
        <div className="h-screen w-full flex flex-col">
            <header className="bg-indigo-500 h-16 flex justify-center items-center text-white">
                Stopwatch
            </header>
            <main className="flex flex-col flex-grow">
                <section
                    className={clsx({
                        "flex flex-grow items-center duration-200 transition-colors justify-center":
                            true,
                        "bg-indigo-100": processedTime.seconds % 2 === 0,
                        "bg-blue-100": processedTime.seconds % 2 !== 0,
                    })}
                >
                    <div className="flex items-center space-x-4 tabular-nums">
                        <TimeUnitDisplay
                            time={processedTime.minutes}
                            unit="minutes"
                        />
                        <span className="font-bold text-3xl md:text-5xl">
                            :
                        </span>
                        <TimeUnitDisplay
                            time={processedTime.seconds}
                            unit="seconds"
                        />
                        <span className="font-bold text-3xl md:text-5xl">
                            :
                        </span>
                        <TimeUnitDisplay
                            time={processedTime.milliseconds}
                            unit="hundredths"
                        />
                    </div>
                </section>
                <section className="px-8 py-12">
                    <button
                        className={`w-full p-4 h-14 text-center ${
                            isRunning
                                ? "text-indigo-500 bg-indigo-200 border border-gray-500"
                                : "text-white bg-indigo-500 hover:bg-indigo-600"
                        } transition-colors duration-300 rounded-3xl`}
                        onClick={toggleRunningState}
                    >
                        {isRunning ? "Stop" : "Start"}
                    </button>
                </section>
            </main>
        </div>
    );
}

const padDigits = (digits: number) => {
    return String(digits).padStart(2, "0");
};

export default App;
