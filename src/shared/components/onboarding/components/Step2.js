import React from "react";
import OnboardingStep from "./OnboardingStep";
import Step2Image from "@/shared/assets/OnboardingStep2.png"

export default function Step2(props) {
    return (
        <OnboardingStep
            {...props}
            image={Step2Image}
            titleKey="onboardingStep2Title"
            descriptionKey="onboardingStep2Description"
        />
    );
}
