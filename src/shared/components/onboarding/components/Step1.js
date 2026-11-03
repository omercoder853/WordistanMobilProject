import React from "react";
import OnboardingStep from "./OnboardingStep";
import Step1Image from "@/shared/assets/OnboardingStep1.png"

export default function Step1(props) {
    return (
        <OnboardingStep
            {...props}
            image={Step1Image}
            titleKey="onboardingStep1Title"
            descriptionKey="onboardingStep1Description"
        />
    );
}
