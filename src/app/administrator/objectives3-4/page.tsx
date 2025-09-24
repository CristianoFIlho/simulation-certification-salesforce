import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";
import { administratorObjectives3to4 } from "@/data/administrator-objectives3-4";

export default function AdministratorObjectives3to4() {
  return (
    <>
      <Header />
      <QuizComponent 
        questions={administratorObjectives3to4} 
        title="Configuration and Setup (Objectives 3-4) - Admin"
      />
      <Footer />
    </>
  );
}
