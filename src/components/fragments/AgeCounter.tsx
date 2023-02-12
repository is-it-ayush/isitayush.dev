import {useState, useEffect} from "react";

export const AgeCounter = () => {
    const [age, setAge] = useState(0);
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const age = await calculateAgeToYears();
                setAge(parseFloat(age));
            } catch (e) {
                console.error(e);
            }
        }, 10);
        return () => clearInterval(interval);
    }, [age]);

    return <p>{age}</p>;
};

async function calculateAgeToYears() {
    const myBday = process.env.NEXT_PUBLIC_BIRTHDAY;
    if (myBday) {
        const bday = new Date(Date.parse(myBday));
        const today = new Date();
        const diff = today.valueOf() - bday.valueOf();
        const age = diff / 31556952000;
        return age.toPrecision(13);
    } else {
        console.error(`Blocks/Error: The environment variable NEXT_PUBLIC_BIRTHDAY is not set.`);
        throw new DOMException("Blocks/Error: I guess we will never know how old I am.");
    }
}
