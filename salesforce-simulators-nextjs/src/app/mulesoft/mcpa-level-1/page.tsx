import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";

export default function MCPALevel1() {
  return (
    <>
      <Header />
      <QuizComponent 
        quizSetId="mcpa-level-1"
        options={{
          shuffle: true,
          autoSave: true,
          timeLimit: true
        }}
      />
      <Footer />
    </>
  );
}
