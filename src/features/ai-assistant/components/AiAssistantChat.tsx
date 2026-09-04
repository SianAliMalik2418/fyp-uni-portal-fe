import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  AiChat02Icon,
  Cancel01Icon,
  Delete02Icon,
  SentIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Button } from '@/components/ui/button'
import { Message, MessageAvatar, MessageContent, MessageGroup } from '@/components/ui/message'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { askStudentAssistant } from '../api/ai-assistant-api'
import type { AiConversationMessage } from '../schemas/ai-assistant.schemas'
import { boundedConversation } from '../utils/ai-conversation'

const suggestedQuestions = [
  'What is my CGPA?',
  'When is my next exam?',
  'How much fee is remaining?',
]

type SessionMessage = AiConversationMessage & {
  grounded?: boolean
}

export function AiAssistantChat({ onClose }: { onClose: () => void }) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<SessionMessage[]>([])
  const mutation = useMutation({
    mutationFn: askStudentAssistant,
    onSuccess: (response, request) => {
      setMessages((current) =>
        [
          ...current,
          { role: 'user' as const, content: request.message },
          { role: 'assistant' as const, content: response.answer, grounded: response.grounded },
        ].slice(-8)
      )
      setDraft('')
    },
  })

  function sendQuestion(question: string) {
    const message = question.trim()
    if (!message || mutation.isPending) return
    mutation.mutate({ message, conversation: boundedConversation(messages) })
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendQuestion(draft)
  }

  function clearConversation() {
    setMessages([])
    setDraft('')
    mutation.reset()
  }

  const pendingQuestion = mutation.isPending ? mutation.variables.message : undefined

  return (
    <section
      role="dialog"
      aria-label="AI academic assistant"
      className="border-border bg-background flex h-[min(42rem,calc(100dvh-7rem))] w-full flex-col overflow-hidden rounded-xl border shadow-xl sm:w-96"
    >
      <header className="border-border flex items-start justify-between gap-3 border-b p-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
            <HugeiconsIcon icon={AiChat02Icon} strokeWidth={2} className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">AI academic assistant</h2>
            <p className="text-muted-foreground mt-0.5 text-xs">Student questions, read-only</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Clear conversation"
            onClick={clearConversation}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close AI academic assistant"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {!messages.length && !pendingQuestion ? (
          <div className="grid h-full content-center gap-5 py-4 text-center">
            <div className="mx-auto grid max-w-xs justify-items-center gap-2">
              <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
                <HugeiconsIcon icon={AiChat02Icon} strokeWidth={2} className="size-5" />
              </span>
              <p className="text-sm font-medium">Ask about your academic information</p>
              <p className="text-muted-foreground text-xs leading-5">
                Try a question about your courses, attendance, results, fees, timetable, or exams.
              </p>
            </div>
            <div className="grid gap-2">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start px-3 py-2 text-left whitespace-normal"
                  onClick={() => sendQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <MessageGroup>
            {messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} message={message} />
            ))}
            {pendingQuestion ? (
              <>
                <ChatMessage message={{ role: 'user', content: pendingQuestion }} />
                <Message>
                  <MessageAvatar className="size-8">
                    <HugeiconsIcon icon={AiChat02Icon} strokeWidth={2} className="size-4" />
                  </MessageAvatar>
                  <MessageContent>
                    <Bubble variant="muted">
                      <BubbleContent className="flex items-center gap-2">
                        <Spinner />
                        Checking your portal records
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </>
            ) : null}
          </MessageGroup>
        )}
      </div>

      <div className="border-border grid gap-3 border-t p-3">
        {mutation.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Assistant unavailable</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(
                mutation.error,
                'The assistant could not answer. Your question was not added to this conversation.'
              )}
            </AlertDescription>
          </Alert>
        ) : null}
        <form className="flex items-end gap-2" onSubmit={submitQuestion}>
          <Textarea
            aria-label="Ask the AI academic assistant"
            placeholder="Ask about your portal records..."
            rows={2}
            maxLength={1_000}
            value={draft}
            disabled={mutation.isPending}
            className="max-h-28 min-h-16 resize-none"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send question"
            disabled={!draft.trim() || mutation.isPending}
          >
            {mutation.isPending ? <Spinner /> : <HugeiconsIcon icon={SentIcon} strokeWidth={2} />}
          </Button>
        </form>
        <p className="text-muted-foreground text-[11px] leading-4">
          Answers use your signed-in portal records and approved university information. This
          assistant cannot change records. Conversation history is kept only for this session.
        </p>
      </div>
    </section>
  )
}

function ChatMessage({ message }: { message: SessionMessage }) {
  const isStudent = message.role === 'user'
  return (
    <Message align={isStudent ? 'end' : 'start'}>
      <MessageAvatar className="size-8">
        <HugeiconsIcon
          icon={isStudent ? UserIcon : AiChat02Icon}
          strokeWidth={2}
          className="size-4"
        />
      </MessageAvatar>
      <MessageContent>
        <Bubble variant={isStudent ? 'default' : 'muted'}>
          <BubbleContent>{message.content}</BubbleContent>
        </Bubble>
        {!isStudent && message.grounded === false ? (
          <p className="text-muted-foreground px-3 text-[11px]">No trusted answer found</p>
        ) : null}
      </MessageContent>
    </Message>
  )
}
