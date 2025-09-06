import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";
import { mcpaLevel1 } from "@/data/mcpa-level1";

export default function MCPALevel1() {
  return (
    <>
      <Header />
      <QuizComponent 
        questions={mcpaLevel1} 
        title="MCPA - LEVEL 1 (Training platform)"
      />
      <Footer />
    </>
  );
}
