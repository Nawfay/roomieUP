import { MessagesView } from "@/components/messages/messageview"

export default async function MessagePage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params
  return <MessagesView matchId={matchId} />
}
