import { getAllQuestions } from "@/lib/data/questions"
import QuestionsManager from "@/components/questions/questions-manager"

export default function QuestionsPage() {
  return <QuestionsManager initialQuestions={getAllQuestions()} />
}
