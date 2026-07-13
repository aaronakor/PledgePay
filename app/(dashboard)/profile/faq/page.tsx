'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import styles from './FAQ.module.css'

const faqItems = [
  {
    question: 'What is PledgePay?',
    answer:
      'PledgePay helps people create, track, and manage financial commitments with people they trust. It provides reminders, repayment tracking, activity history, and accountability without harassment.',
  },
  {
    question: 'Is my bank information secure?',
    answer:
      'Yes. Your bank information is only used to support repayments and account management. Other users cannot view your banking details. PledgePay does not share your information with other users without your permission.',
  },
  {
    question: 'How do repayments work?',
    answer:
      'When a pledge is active, the borrower can make repayments through the repayment flow provided within the pledge. Payments are recorded and reflected in the pledge balance and activity history.',
  },
  {
    question: 'Can I edit a pledge?',
    answer:
      'Certain pledge details may be editable before a pledge becomes active. Once a pledge has been accepted or funded, some information may be locked to preserve accountability and record accuracy.',
  },
  {
    question: 'What happens when a pledge becomes overdue?',
    answer:
      'If a repayment is not completed by the agreed due date, the pledge may be marked as overdue. Both parties can continue viewing the pledge history and repayment status while reminders may continue according to the selected reminder settings.',
  },
  {
    question: 'Can I delete my account?',
    answer:
      'You can request account deletion through your account settings. Certain pledge records may be retained where required to preserve financial history and platform integrity.',
  },
  {
    question: 'How is my trust score calculated?',
    answer:
      'Your trust score reflects your activity and reliability on PledgePay. Factors may include completed commitments, repayment consistency, overdue pledges, and overall pledge history.',
  },
  {
    question: 'What happens if someone ignores repayments?',
    answer:
      'PledgePay provides reminders, tracking, and accountability tools, but it does not enforce repayments. The platform helps both parties maintain a transparent record of commitments and repayment history.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggleItem(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/profile" className={styles.backLink} aria-label="Back to profile">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className={styles.pageTitle}>FAQs</h1>
      </header>

      <div className={styles.accordion}>
        {faqItems.map((item, index) => (
          <div key={index} className={styles.accordionItem}>
            <button
              type="button"
              className={styles.accordionTrigger}
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className={styles.questionText}>{item.question}</span>
              <ChevronDown
                className={`${styles.chevron} ${openIndex === index ? styles.chevronOpen : ''}`}
              />
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`${styles.accordionContent} ${openIndex === index ? styles.accordionContentOpen : ''}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
            >
              <p className={styles.answerBody}>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
