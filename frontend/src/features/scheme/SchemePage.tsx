import React from "react";
import { FormattedMessage } from "react-intl";
import InfoBox from "@/shared/components/info-box/InfoBox";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { Img } from "@/core/constants/img";
import "./scheme-page.scss";

export default function SchemePage() {
  return (
    <main className="scheme-page">
      <TitleHelment title={"Scheme"} />

      <section className="clients about">
        <div className="container">
          <div className="block-title mx-auto">
            AI <FormattedMessage id="scheme" />
          </div>
          <div className="scheme-img-wrapper mx-auto">
            <img src={Img.scheme} alt={Img.scheme} className="w-100" />
          </div>
        </div>
      </section>
    </main>
  );
}
