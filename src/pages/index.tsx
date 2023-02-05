import {ThemeButton} from "@src/components/fragments/ThemeButton";
import {Text} from "@src/components/ui/Text";

export default function Landing() {
    return (
        <main className="flex min-h-screen w-full justify-center items-center p-10 bg-white dark:bg-black">
            <div className="absolute flex top-5 right-5">
                <ThemeButton />
            </div>
            <Text weight="light">Namaste!</Text>
        </main>
    );
}
