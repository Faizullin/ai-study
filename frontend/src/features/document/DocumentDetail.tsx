import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import {
  fetchDocumentDetail,
  fetchDocumentRate,
} from "@/core/redux/store/reducers/documentSlice";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import { useParams } from "react-router-dom";
import { Img } from "@/core/constants/img";
import RatingField from "@/shared/components/document/RatingField";
import {
  LoadingPopularDocumentItemCard,
  PopularDocumentItemCard,
} from "../../shared/components/document/PopularDocumentItemCard";
import { modalIds, openModal } from "@/core/redux/store/reducers/modalSlice";
import { fetchMlSearchContentBasedList } from "@/core/redux/store/reducers/mlSearchSlice";
import CourseItemCard from "@/shared/components/course/CourseItemCard";
import { FormattedMessage } from "react-intl";

import "./document-detail.scss";
import FileViewer from "@/shared/components/document/FileViewer";

interface IDocumentDetailProps {}

const DocumentDetail: FC<IDocumentDetailProps> = () => {
  const dispatch = useAppDispatch();
  const { document_payload, loading } = useAppSelector(
    (state) => state.document
  );
  const { documentsContentBased, loading: mlLoading } = useAppSelector(
    (state) => state.mlSearch
  );
  const { id: item_id } = useParams();
  const document_read_files = React.useMemo(() => {
    if (!document_payload?.files) return [];
    if (!document_payload.featured_image) return document_payload.files;
    return document_payload.files.filter(
      (fileItem) => fileItem.id !== document_payload.featured_image.id
    );
  }, [document_payload]);

  const handleRate = (value: number) => {
    dispatch(
      fetchDocumentRate({
        item_id: document_payload.id,
        value,
      })
    );
  };

  React.useEffect(() => {
    if (item_id) {
      dispatch(fetchDocumentDetail(Number(item_id)));
      dispatch(fetchMlSearchContentBasedList(Number(item_id)));
    }
  }, [dispatch, item_id]);

  return (
    <main className="document-detail d-flex flex-column flex-grow-1">
      <TitleHelment title={document_payload?.title || "Document"} />
      <section className="clients bg-white">
        <div className="container">
          <div className="document-item-detail-data m-0 p-0 row">
            {/* d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-self-stretch */}
            <a
              href="#"
              className="document-item-detail-popup__thumbnail col-12 col-md-6 p-0"
            >
              <img
                src={document_payload?.featured_image?.url || Img.not_found}
                alt={document_payload?.featured_image?.url}
                className="w-100 h-100 object-fit-cover"
              />
            </a>
            <div className="d-flex flex-column col-12 col-md-6 px-4 ps-md-5 pb-4 mb-5 mb-md-1">
              <p className="document-item-detail-popup__title text-wrap">
                {document_payload?.title}
              </p>
              <p className="document-item-detail-popup__description text-wrap">
                {document_payload?.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="clients bg-f9fb d-flex flex-column flex-grow-1">
        <div className="container d-flex flex-column flex-grow-1 ">
          <div className="document-content mt-3 mt-sm-5">
            <div className="w-100">
              <div
                className="ck-content"
                dangerouslySetInnerHTML={{
                  __html: document_payload?.content || "",
                }}
              ></div>
            </div>
          </div>
          <div className="document-files mt-3 mt-sm-5">
            <div className="w-100">
              {document_payload?.files.map((item) => (
                <div key={item.id} className="">
                  <FileViewer file={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="clients bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6">
              {/* <div className="course-item-card p-0 d-flex justify-content-start">
                <a
                  href="#"
                  className="course-item-card__thumbnail overflow-hidden"
                >
                  <img
                    src={document_payload?.course?.image || Img.not_found}
                    alt=""
                    className="w-100 h-100 object-fit-cover"
                  />
                </a>
                <div className="course-item-card__title-wrapper">
                  <a href="#">{document_payload?.course?.title}</a>
                </div>
                <div className="course-item-card__subject-list">
                  <div className=" d-flex align-self-start flex-wrap flex-grow-0">
                    {document_payload?.course?.subject && (
                      <a
                        href="#"
                        className="course-item-card__subject-item c-text-color-primary"
                      >
                        {document_payload.course.subject?.title}
                      </a>
                    )}
                    {document_payload?.subjects?.map((subject_item) => (
                      <a
                        key={`${subject_item.id}-${subject_item.id}`}
                        href="#"
                        className="course-item-card__subject-item"
                      >
                        {subject_item.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div> */}
              <CourseItemCard item={document_payload?.course} />
            </div>
            <div className="col-12 col-sm-6">
              <div>
                {document_payload && (
                  <RatingField
                    value={document_payload.rating_avg}
                    onClick={handleRate}
                    processing={loading.post}
                  />
                )}
              </div>
              <div className="d-flex">
                {document_payload && (
                  <RatingField
                    value={document_payload.my_rating_value}
                    onClick={handleRate}
                    processing={loading.post}
                  />
                )}
                <p>
                  <FormattedMessage id="BVe2ss" defaultMessage="My ratings" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="clients bg-f9fb">
        <div className="container">
          <div className="block-title mx-auto">
            <FormattedMessage
              id="r/NFj3"
              defaultMessage="Similar docs (AI-selected)"
            />
          </div>
          <div className="document-cb-grid row">
            {mlLoading.list
              ? Array(6)
                  .fill(1)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="col-12 col-md-6 d-flex justify-content-center d-md-block"
                    >
                      <LoadingPopularDocumentItemCard />{" "}
                    </div>
                  ))
              : documentsContentBased.map((item) => (
                  <div
                    key={item.id}
                    className="col-12 col-md-6 d-flex justify-content-center d-md-block"
                  >
                    <PopularDocumentItemCard
                      key={item.id}
                      item={item}
                      onDocumentDetailClick={() => {
                        dispatch(
                          openModal({
                            id: modalIds.documentItemDetailPopup,
                            closeOther: true,
                            props: {
                              item,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DocumentDetail;
