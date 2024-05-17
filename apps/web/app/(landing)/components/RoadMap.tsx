import { Card, CardContent, CardHeader, CardTitle } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { Heading } from './Heading'

export interface RoadMapProps extends HTMLAttributes<HTMLElement> {}

export const RoadMap = () => {
  return (
    <section className="w-full flex-center pb-10 xl:pb-32 md:pt-20 2xl:pt-56" id="RoadMap">
      <div className="flex flex-col gap-10  xl:gap-14 relative">
        <Heading>Concept and Road Map</Heading>

        <Card className="w-full xl:max-w-2xl relative">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-4xl bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              AI Flow Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            AI Flow Generator simplifies the automation of tasks across multiple apps, it builds flows for you. This feature will use advanced AI to
            intuitively generate workflows that connect various applications depending on your order, saving you time and effort. Automate repetitive
            tasks and enhance your productivity with seamless integration and intelligent suggestions.
          </CardContent>
          <div
            className="w-3/5 h-1/6 inline-block rotate-1 bg-primary absolute top-[0%] -left-[10%] blur-[75px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          />
        </Card>

        <Card className="w-full xl:max-w-2xl relative">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-4xl bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Linkerry DAO
            </CardTitle>
          </CardHeader>
          <CardContent>
            DAO for Linkerry. Users will have the ability to vote on which app should be added first and which new features should be developed next.
            This ensures that our platform evolves according to the needs and desires of its user base, fostering a collaborative and democratic
            approach to development.
          </CardContent>
          <div
            className="w-3/5 h-2/6 inline-block rotate-1 bg-primary absolute top-[0%] -right-[10%] blur-[75px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          />
        </Card>

        <Card className="w-full xl:max-w-2xl relative">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-4xl bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Focused on Web3 and AI Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            Integrate effortlessly with the future of decentralized technology through our Web3 Decentralized Apps feature. This includes
            compatibility with decentralized exchanges (DEX) and other blockchain-based applications. Enhance your workflows with the security,
            transparency, and efficiency of decentralized applications, positioning your operations at the cutting edge of technology.
          </CardContent>
          <div
            className="w-3/5 h-1/6 inline-block rotate-1 bg-primary absolute top-[0%] -left-[10%] blur-[75px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          />
        </Card>

        <Card className="w-full xl:max-w-2xl relative">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-4xl bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Many Triggers, One Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            Increase the flexibility and efficiency of your workflows with the Many Triggers, One Flow feature. This allows a single automated flow to
            be initiated by multiple triggers, providing a more dynamic and responsive automation experience. Whether it;&apos;s an email, a calendar
            event, or a new database entry, multiple conditions can now seamlessly kickstart the same process.
          </CardContent>
          <div
            className="w-3/5 h-1/6 inline-block rotate-1 bg-primary absolute top-[0%] -right-[10%] blur-[75px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          />
        </Card>

        <Card className="w-full xl:max-w-2xl relative">
          <CardHeader>
            <CardTitle className="text-3xl xl:text-4xl bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Start Flow From Everywhere
            </CardTitle>
          </CardHeader>
          <CardContent>
            Convenience is key with our Run From Everyday feature. Users can now initiate flows directly from their mobile devices using dynamic
            inputs. Simply provide a string or other input on the go, and watch your automation flow activate instantly. This feature ensures that
            your workflows are always at your fingertips, ready to respond to your daily needs.
          </CardContent>
          <div
            className="w-3/5 h-1/6 inline-block rotate-1 bg-primary absolute top-[0%] -left-[10%] blur-[75px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          />
        </Card>
      </div>
    </section>
  )
}
