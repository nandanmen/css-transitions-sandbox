import Head from 'next/head'
import TransitionSandbox from '../components/TransitionSandbox'

export default function Home() {
  return (
    <>
      <Head>
        <title>CSS Transition Sandbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <TransitionSandbox />
      </main>
    </>
  )
}
