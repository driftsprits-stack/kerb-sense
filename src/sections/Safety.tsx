import * as Accordion from '@radix-ui/react-accordion';
import Section from '../components/Section';
import { SAFETY } from '../content';
import { SLOT } from '../copy';

export default function Safety() {
  const three = [SAFETY.website, SAFETY.game, SAFETY.programme];
  return (
    <Section id="safety" slot={SLOT.safety} summary={SAFETY.summary}>
      <p className="ks-display text-40 md:text-64">{SAFETY.big}</p>
      <div className="mt-8 grid grid-cols-1 gap-6 border-t-[3px] border-black pt-6 md:grid-cols-3">
        {three.map((item) => (
          <div
            key={item.title}
            className="border-b border-black pb-4 md:border-b-0 md:border-r md:pr-6 md:last:border-r-0"
          >
            <h3 className="text-16 font-bold">{item.title}</h3>
            <p className="mt-2 text-14">{item.body}</p>
          </div>
        ))}
      </div>
      <Accordion.Root
        type="multiple"
        className="mt-10 border-t-[3px] border-black"
        data-testid="safety-accordion"
      >
        {SAFETY.items.map((item, i) => (
          <Accordion.Item key={item.title} value={String(i)} className="border-b border-black">
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-left text-20 font-bold hover:bg-black hover:text-white">
                  <span className="px-2">{item.title}</span>
                  <span className="px-2 text-28" aria-hidden="true">
                    <span className="group-data-[state=open]:hidden">+</span>
                    <span className="hidden group-data-[state=open]:inline">&minus;</span>
                  </span>
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-4 text-16">{item.body}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Section>
  );
}
