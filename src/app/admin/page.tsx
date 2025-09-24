import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionAdmin from "@/components/QuestionAdmin";

export default function AdminPage() {
  return (
    <>
      <Header />
      <div className="admin-page">
        <QuestionAdmin quizSetId="administrator-objectives-1-2" />
      </div>
      <Footer />
    </>
  );
}
