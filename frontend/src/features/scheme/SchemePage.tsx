import React from "react";
import { FormattedMessage } from "react-intl";
import InfoBox from "@/shared/components/info-box/InfoBox";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { Img } from "@/core/constants/img";

export default function SchemePage() {
  return (
    <main className="home-page">
      <TitleHelment title={"Scheme"} />

      <section className="clients about">
        <div className="container">
          <div className="block-title mx-auto">
            AI <FormattedMessage id="scheme" />
          </div>
          <img src={Img.scheme} alt={Img.scheme} className="w-100" />
        </div>
      </section>
    </main>
  );
}
