import React from 'react'
import BezierEasing from 'bezier-easing'
import { BsPlay, BsStop } from 'react-icons/bs'
import useInterval from '@use-it/interval'
import { motion } from 'framer-motion'

const easingFunctions = {
  linear: BezierEasing(0, 0, 1, 1),
  ease: BezierEasing(0.25, 0.1, 0.25, 1),
  'ease-in': BezierEasing(0.42, 0, 1, 1),
  'ease-out': BezierEasing(0, 0, 0.58, 1),
  'ease-in-out': BezierEasing(0.42, 0, 0.58, 1),
  'ease (supercharged)': BezierEasing(0.44, 0.21, 0, 1),
  'ease-in (supercharged)': BezierEasing(0.75, 0, 1, 1),
  'ease-out (supercharged)': BezierEasing(0.215, 0.61, 0.355, 1),
  'ease-in-out (supercharged)': BezierEasing(0.645, 0.045, 0.355, 1),
}

const shapes = ['circle', 'square']

export default function TransitionSandbox() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [fps, setFps] = React.useState(60)
  const [easing, setEasing] = React.useState('ease-in-out (supercharged)')
  const [ghostOpacity, setGhostOpacity] = React.useState(0.2)
  const [shape, setShape] = React.useState('circle')

  const easingFunction = easingFunctions[easing]
  const steps = React.useMemo(() => getSteps(easingFunction, fps), [
    easingFunction,
    fps,
  ])

  const [activeStepIndex, setActiveStepIndex] = React.useState(steps.length - 1)

  React.useEffect(() => {
    setActiveStepIndex(steps.length - 1)
  }, [steps])

  useInterval(
    () => {
      if (activeStepIndex < steps.length - 1) {
        setActiveStepIndex((index) => index + 1)
      } else {
        setIsPlaying(false)
      }
    },
    isPlaying ? 1000 / fps : null
  )

  return (
    <div className="p-6 space-y-8 text-white bg-black border-4 border-gray-700 shadow-xl rounded-xl md:p-12">
      <h1 className="font-semibold">{fps} FPS</h1>
      <div className="relative h-12 mr-12">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            style={{
              '--x': `${step * 100}%`,
              '--opacity':
                index === activeStepIndex
                  ? 1
                  : index > activeStepIndex
                  ? 0
                  : ghostOpacity,
            }}
            className="absolute top-0 w-12 h-12 border-4 border-red-400 shape"
            variants={{
              circle: {
                borderRadius: 24,
              },
              square: {
                borderRadius: 8,
              },
            }}
            initial={shape}
            animate={shape}
          />
        ))}
      </div>
      <form className="space-y-4" onSubmit={(evt) => evt.preventDefault()}>
        <div className="flex items-center w-full space-x-4">
          <Field label="Timeline" className="flex-1">
            <input
              type="range"
              min="0"
              value={activeStepIndex}
              max={steps.length - 1}
              onChange={(evt) => setActiveStepIndex(Number(evt.target.value))}
            />
          </Field>
          <Field label="FPS" className="flex-1">
            <input
              type="range"
              min="5"
              max="60"
              value={fps}
              onChange={(evt) => setFps(evt.target.value)}
            />
          </Field>
          <motion.button
            className="flex items-center justify-center w-12 h-12 text-3xl text-black bg-white rounded-lg focus:outline-none focus:ring-4 ring-red-700"
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false)
              } else {
                setActiveStepIndex((index) =>
                  index === steps.length - 1 ? 0 : index
                )
                setIsPlaying(true)
              }
            }}
            initial={{ y: 14 }}
            animate={{ y: 14 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <BsStop /> : <BsPlay />}
          </motion.button>
        </div>
        <div className="flex flex-wrap" style={{ gap: '1rem' }}>
          <Field label="Timing Function">
            <Select
              options={Object.keys(easingFunctions)}
              value={easing}
              onChange={setEasing}
            />
          </Field>{' '}
          <Field label="Shape">
            <Select
              options={shapes}
              className="capitalize"
              value={shape}
              onChange={setShape}
            />
          </Field>
          <Field label="Ghost Opacity">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ghostOpacity}
              onChange={(evt) => setGhostOpacity(evt.target.value)}
            />
          </Field>
        </div>
      </form>
    </div>
  )
}

function Select({ className = '', onChange, options, ...props }) {
  return (
    <select
      className={`block w-full p-2 pr-4 mt-2 bg-black border-2 border-gray-700 rounded-md ring-red-700 focus:outline-none focus:ring-4 ${className}`}
      onChange={(evt) => onChange(evt.target.value)}
      {...props}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  )
}

function Field({ label, className = '', children }) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="text-sm font-semibold uppercase">{label}</span>
      {children}
    </label>
  )
}

function getSteps(easingFn, fps) {
  const steps = Array.from({ length: fps })
    .fill(-1)
    .map((_, index) => easingFn(index / fps))
  steps.push(easingFn(1))
  return steps
}
