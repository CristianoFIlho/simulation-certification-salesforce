import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizComponent from "@/components/QuizComponent";
import { administratorObjectives5to6 } from "@/data/administrator-objectives5-6";

export default function AdministratorObjectives5to6() {
  return (
    <>
      <Header />
      <QuizComponent 
        questions={administratorObjectives5to6} 
        title="Configuration and Setup (Objectives 5-6) - Admin"
      />
      <Footer />
    </>
  );
}
