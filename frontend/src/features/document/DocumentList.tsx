import React, { FC, ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { Tab, Tabs } from "react-bootstrap";
import PrimaryPagination from "@/shared/components/pagination/PrimaryPagination";
import { IDocument } from "@/core/models/IDocument";
import DocumentItemCard from "./components/DocumentItemCard";
import { fetchDocumentList } from "@/core/redux/store/reducers/documentSlice";
import { modalIds, openModal } from "@/core/redux/store/reducers/modalSlice";
import {
  fetchMlSearchCollaborativeFilteredList,
  fetchMlSearchContentBasedList,
} from "@/core/redux/store/reducers/mlSearchSlice";

import "./document-list.scss";
import { useLocation } from "react-router-dom";
import SearchInput from "@/shared/components/form/SearchInput";

interface ISorting {
  type: "desc" | "asc";
  field: string;
}

interface ISubjectFilters {
  id: number;
  title: string;
  articles_count: number;
  active?: boolean;
}

interface IFilters {
  subjects: Array<ISubjectFilters>;
  pagination: {
    page_size: number;
    page: number;
  };
  ordering: ISorting;
  search: string;
}

type TTabKeyName = "home" | "cb" | "cf";
const tabs: Record<
  TTabKeyName,
  {
    title: string;
    children: FC<{
      onDetailOpen: (item: IDocument) => void;
    }>;
  }
> = {
  home: {
    title: "Home",
    children: ({ onDetailOpen }) => {
      const dispatch = useAppDispatch();
      const { documents, pagination_data } = useAppSelector(
        (state) => state.document
      );
      const [page, setPage] = useState<number>(1);

      useEffect(() => {
        dispatch(
          fetchDocumentList({
            page_size: 10,
            page,
          })
        );
      }, [page]);

      return (
        <>
          <div className="filters-field">
            <SearchInput
              value="ASV"
              onChange={() => {}}
              onSubmit={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="document-grid row">
            {documents.map((item) => (
              <div
                key={item.id}
                className="col-12 col-md-6 d-flex justify-content-center d-md-block"
              >
                <DocumentItemCard
                  key={item.id}
                  item={item}
                  onOpen={() => {
                    onDetailOpen(item);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="document-list__pagination-wrapper d-flex justify-content-center">
            <PrimaryPagination
              page={page - 1}
              pageSize={10}
              count={pagination_data.totalItems}
              onChangePage={(value) => {
                setPage(value + 1);
              }}
            />
          </div>
        </>
      );
    },
  },
  cf: {
    title: "Cf",
    children: ({ onDetailOpen }) => {
      const dispatch = useAppDispatch();
      const { documentsCollaborativeFiltered, pagination_data } =
        useAppSelector((state) => state.mlSearch);
      const [page, setPage] = useState<number>(1);

      useEffect(() => {
        dispatch(
          fetchMlSearchCollaborativeFilteredList({
            page_size: 10,
            page,
          })
        );
      }, [page]);

      return (
        <>
          <div className="document-grid row">
            {documentsCollaborativeFiltered.map((item) => (
              <div
                key={item.id}
                className="col-12 col-md-6 d-flex justify-content-center d-md-block"
              >
                <DocumentItemCard
                  key={item.id}
                  item={item}
                  onOpen={() => {
                    onDetailOpen(item);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="document-list__pagination-wrapper d-flex justify-content-center">
            <PrimaryPagination
              page={page - 1}
              pageSize={10}
              count={pagination_data.totalItems}
              onChangePage={(value) => {
                setPage(value + 1);
              }}
            />
          </div>
        </>
      );
    },
  },
  cb: {
    title: "Cb",
    children: () => {
      return <div></div>;
    },
  },
};

export default function DocumentList() {
  const dispatch = useAppDispatch();
  const currentLocation = useLocation();
  const [currentTabKey, setCurrentTabKey] = useState<TTabKeyName>("home");
  const [selectedItem, setSelectedItem] = useState<IDocument | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (currentLocation.hash) {
      const element = document.getElementById(
        currentLocation.hash.substring(1)
      );
      if (element) {
        console.log(element);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      dispatch(
        openModal({
          id: modalIds.documentItemDetailPopup,
          props: {
            item: selectedItem,
          },
        })
      );
    }
  }, [selectedItem]);

  return (
    <main className="document-list d-flex flex-column flex-grow-1">
      <TitleHelment title={"Documents"} />
      <section className="clients bg-white d-flex flex-column flex-grow-1">
        <div className="container d-flex flex-column flex-grow-1">
          <Tabs
            activeKey={currentTabKey}
            onSelect={(k: TTabKeyName) => setCurrentTabKey(k)}
            className="mb-3"
          >
            {Object.keys(tabs).map((key) => (
              <Tab key={key} eventKey={key} title={tabs[key].title}>
                {tabs[key as TTabKeyName].children({
                  onDetailOpen: (item: IDocument) => {
                    setSelectedItem(item);
                    setIsDetailPopupOpen(true);
                  },
                })}
              </Tab>
            ))}
          </Tabs>
        </div>
      </section>
    </main>
  );
}
