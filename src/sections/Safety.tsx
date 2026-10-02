import * as Accordion from '@radix-ui/react-accordion';
import SectionTab from '../components/SectionTab';
import { SAFETY } from '../content';

export default function Safety() {
  return (
    <section id="safety" className="field-red border-t-[3px] border-black" aria-labelledby="safety-title">
      <div className="ks-container py-12 md:py-20">
        <SectionTab number={7} title={SAFETY.headline} field="red" point="left" id="safety-title" />
        <div className="ks-grid mt-10 gap-y-10">
          <div className="col-span-4 md:col-span-6">
            <p className="ks-display text-64 text-white md:text-96">{SAFETY.big}</p>
            <p className="mt-6 text-20 text-white">{SAFETY.lead}</p>
          </div>
          <div className="col-span-4 md:col-span-6">
            <Accordion.Root
              type="multiple"
              className="border-t-[3px] border-white text-white"
              data-testid="safety-accordion"
            >
              {SAFETY.items.map((item, i) => (
                <Accordion.Item key={item.title} value={String(i)} className="border-b border-white">
                  <Accordion.Header asChild>
                    <h3>
                      <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-left text-20 font-bold hover:bg-white hover:text-red">
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
          </div>
        </div>
      </div>
    </section>
  );
}
