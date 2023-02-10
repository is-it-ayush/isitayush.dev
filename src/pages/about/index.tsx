import {AgeCounter} from "@src/components/fragments/AgeCounter";
import {Container} from "@src/components/ui/Container";
import {Text} from "@src/components/ui/Text";

export default function AboutPage() {
    return (
        <div className="flex flex-col space-y-4 max-w-[400px]">
            <Container>
                <Text weight="medium" size="xl">
                    About
                </Text>
                <Text weight="normal" size="sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec tincidunt lacinia,
                    nisl nisl aliquam massa, nec lacinia nisl nisl sit amet tortor. Sed euismod, nisl nec tincidunt
                    lacinia, nisl nisl aliquam massa, nec lacinia nisl nisl sit amet tortor.
                </Text>
            </Container>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col lg:flex-row gap-2">
                    <Container className="lg:min-w-[50%]">
                        <Text weight="medium" size="lg">
                            Age
                        </Text>
                        <AgeCounter />
                    </Container>
                    <Container>

                    </Container>
                </div>
            </div>
        </div>
    );
}
