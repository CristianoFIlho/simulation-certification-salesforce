import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";
import { mcdLevel2 } from "@/data/mcd-level2";

export default function MCDLevel2() {
  return (
    <>
      <Header />
      <QuizComponent 
        questions={mcdLevel2} 
        title="MCD - LEVEL 2 (Training platform)"
      />
      <Footer />
    </>
  );
}
