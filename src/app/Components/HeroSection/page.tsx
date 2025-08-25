import React from "react";

interface HeroSectionProps {
  handlePracticeProblems: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  handlePracticeProblems,
}) => {
  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 text-center">
      <h1 className="text-5xl font-bold mb-4">Learn. Code. Compete.</h1>
      <p className="text-xl mb-8">
        Master programming with problems, contests and coding languages
      </p>
      <div className="flex gap-4 justify-center">
        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Start Coding
        </button>
        <button
          onClick={handlePracticeProblems}
          className="border cursor-pointer border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600"
        >
          Practice Problems
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
