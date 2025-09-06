import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";
import { administratorObjectives1to2 } from "@/data/administrator-objectives1-2";

export default function AdministratorObjectives1to2() {
  return (
    <>
      <Header />
      <QuizComponent 
        questions={administratorObjectives1to2} 
        title="Configuration and Setup (Objectives 1-2) - Admin"
      />
      <Footer />
    </>
  );
}
