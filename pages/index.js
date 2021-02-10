import Head from 'next/head'
import TransitionSandbox from '../components/TransitionSandbox'

export default function Home() {
  return (
    <>
      <Head>
        <title>CSS Transition Sandbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-900 flex justify-center items-center">
        <TransitionSandbox />
      </main>
    </>
  )
}
