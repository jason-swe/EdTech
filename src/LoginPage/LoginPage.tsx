import { LoginFormPanel } from './LoginFormPanel'
import { LoginHeroPanel } from './LoginHeroPanel'
import { OnlineHelpFab } from './OnlineHelpFab'

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#EDF3FC] px-4 py-5 font-sans antialiased sm:px-6 sm:py-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 items-center">
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#E5EBF5] bg-[#F6F9FF] shadow-[0_20px_48px_rgba(10,35,80,0.08)] lg:min-h-[680px] lg:flex-row">
          <LoginHeroPanel />
          <LoginFormPanel />
        </div>
      </div>
      <OnlineHelpFab />
    </div>
  )
}
