import React, { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { Tab, Tabs } from "react-bootstrap";
import PrimaryPagination from "@/shared/components/pagination/PrimaryPagination";
import { IDocument } from "@/core/models/IDocument";
import DocumentItemCard from "./components/DocumentItemCard";
import {
  fetchDocumentList,
  setFilterData,
} from "@/core/redux/store/reducers/documentSlice";
import { modalIds, openModal } from "@/core/redux/store/reducers/modalSlice";
import {
  fetchMlSearchCollaborativeFilteredList,
  setFilterData as setFilterDataCb,
} from "@/core/redux/store/reducers/mlSearchSlice";
import { useLocation } from "react-router-dom";
import FiltersView from "./components/FiltersView";
import {
  fetchCourseList,
  fetchSubjectList,
} from "@/core/redux/store/reducers/filterSlice";
import "./document-list.scss";

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
      const { isAuthenticated } = useAppSelector((state) => state.auth);
      const { documents, pagination_data, filter_data } = useAppSelector(
        (state) => state.document
      );
      const [page, setPage] = useState<number>(1);

      const handleFilterChange = (filters: any) => {
        dispatch(
          setFilterData({
            ...filters,
          })
        );
      };

      useEffect(() => {
        if (!isAuthenticated) {
          return;
        }
        dispatch(
          fetchDocumentList({
            page_size: 10,
            page,
          })
        );
      }, [
        page,
        filter_data.search,
        filter_data.course,
        filter_data.subjects,
        filter_data.subscribed,
        isAuthenticated,
      ]);
      return (
        <>
          <div className="mb-3">
            <FiltersView
              onFilterChange={handleFilterChange}
              selected_filter_data={filter_data}
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
    title: "Collaborative filtering",
    children: ({ onDetailOpen }) => {
      const dispatch = useAppDispatch();
      const { isAuthenticated } = useAppSelector((state) => state.auth);
      const { documentsCollaborativeFiltered, pagination_data, filter_data } =
        useAppSelector((state) => state.mlSearch);
      const [page, setPage] = useState<number>(1);

      const handleFilterChange = (filters: any) => {
        dispatch(
          setFilterDataCb({
            ...filters,
          })
        );
      };

      useEffect(() => {
        if (!isAuthenticated) {
          return;
        }
        dispatch(
          fetchMlSearchCollaborativeFilteredList({
            page_size: 10,
            page,
          })
        );
      }, [
        page,
        filter_data.search,
        filter_data.course,
        filter_data.subjects,
        filter_data.subscribed,
        isAuthenticated,
      ]);

      return (
        <>
          <div className="mb-3">
            <FiltersView
              onFilterChange={handleFilterChange}
              selected_filter_data={filter_data}
            />
          </div>
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

  useEffect(() => {
    dispatch(fetchCourseList({}));
    dispatch(fetchSubjectList({}));
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
