import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import HeaderSearch from "@/shared/components/header/HeaderSearch";
import { IDocument } from "@/core/models/IDocument";
import PrimaryTable from "@/shared/components/table/PrimaryTable";
import { ITrainCfModelData } from "@/core/models/ITrainModelData";
import { PopularDocumentItemCard } from "../../shared/components/document/PopularDocumentItemCard";
import { useAppDispatch } from "@/core/hooks/redux";
import { modalIds, openModal } from "@/core/redux/store/reducers/modalSlice";
import DocumentService from "@/core/services/DocumentService";
import TrainExportService from "@/core/services/TrainExportService";
import { useDebounced } from "@/core/hooks/useDebounced";
import InfoBox from "@/shared/components/info-box/InfoBox";
import "./about.scss";

export default function About() {
  const dispatch = useAppDispatch();
  const currentLocation = useLocation();
  const [popularDocumentsList, setPopularDocumentsList] = React.useState<
    IDocument[]
  >([]);
  const [trainAccuracyStatsList, setTrainAccuracyStatsList] = React.useState<
    ITrainCfModelData[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounced(searchTerm, 500);

  const onDocumentDetailClick = (selectedItem: IDocument) => {
    dispatch(
      openModal({
        id: modalIds.documentItemDetailPopup,
        props: {
          item: selectedItem,
        },
      })
    );
  };

  React.useEffect(() => {
    if (currentLocation.hash) {
      const element = document.getElementById(
        currentLocation.hash.substring(1)
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    TrainExportService.getTrainExportList({
      page_size: 7,
    }).then((response) => {
      const tmp_data = response.data.results.map((item) => {
        const new_item = { ...item } as ITrainCfModelData;
        if (new_item.train_type === "collaborative") {
          const tmp_description = JSON.parse(new_item.description);
          new_item.rmse_accuracy = tmp_description["RMSE"] || "";
          new_item.mai_accuracy = tmp_description["MAE"] || "";
        }
        return new_item;
      });
      setTrainAccuracyStatsList(tmp_data);
    });
  }, []);

  React.useEffect(() => {
    DocumentService.getPopularItems({
      search: debouncedSearchTerm,
    }).then((response) => {
      setPopularDocumentsList(response.data);
    });
  }, [debouncedSearchTerm]);

  return (
    <main className="home-page">
      <TitleHelment title={"Home"} />

      <section id="about" className="clients about">
        <div className="container">
          <InfoBox
            className="mx-auto"
            title={<FormattedMessage id="about_us" defaultMessage="About us" />}
            content={
              <FormattedMessage
                id="1fG/hw"
                defaultMessage="The website could use AI to automatically summarize documents for students, saving them time and effort.
                We're a team of students passionate about artificial intelligence and its power to revolutionize research. 
                We use specific recommendation system of AI tools to find similarities and analyses of complex documents, making them easier for students to understand and utilize."
              />
            }
          />
        </div>
      </section>

      <section className="clients accuracy-stats clients bg-f9fb">
        <div className="container">
          <div className="block-title mx-auto">
            <FormattedMessage id="Oa8WAE" defaultMessage="Train accuracy stats" />
          </div>
          <div style={{ height: 40 }}></div>
          <PrimaryTable
            data={trainAccuracyStatsList}
            columns={[
              {
                key: "created_at",
                title: "Last update",
              },
              {
                key: "rmse_accuracy",
                title: "RMSE accuracy",
              },
              {
                key: "mai_accuracy",
                title: "MAI accuracy",
              },
              {
                key: "documents_involved_count",
                title: "Docs count",
              },
              {
                key: "users_involved_count",
                title: "Users count",
              },
            ]}
          />
        </div>
      </section>

      <section className="clients interesting-works">
        <div className="container w-100">
          <div className="d-flex justify-content-start row">
            <div className="block-title col-2">
              <FormattedMessage id="S7IK4I" defaultMessage="Agenda" />
            </div>
            <div className="col-11 col-md-5">
              <HeaderSearch
                onChange={function (value: string): void {
                  setSearchTerm(value);
                }}
                onSubmit={function (): void {
                  setSearchTerm(searchTerm);
                }}
                value={searchTerm}
              ></HeaderSearch>
            </div>
          </div>
          <div className="row w-100 interesting-works-grid mx-auto">
            <div className="col-12 col-md-11 col-lg-7 px-0">
              {popularDocumentsList.map((document_item) => (
                <PopularDocumentItemCard
                  key={document_item.id}
                  item={document_item}
                  onDocumentDetailClick={onDocumentDetailClick}
                />
              ))}
            </div>
            <div className="col-5"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
