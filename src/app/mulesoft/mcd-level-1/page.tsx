import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";
import { mcdLevel1 } from "@/data/mcd-level1";

export default function MCDLevel1() {
  return (
    <>
      <Header />
      <QuizComponent 
        questions={mcdLevel1} 
        title="MCD - LEVEL 1 (Training platform)"
      />
      <Footer />
    </>
  );
}
