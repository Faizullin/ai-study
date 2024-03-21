import React, { FC, useEffect, useMemo, useState } from "react";
import { ICourse } from "@/core/models/ICourse";
import { ISubject } from "@/core/models/ISubject";
import SearchInput from "@/shared/components/form/SearchInput";
import { useAppSelector } from "@/core/hooks/redux";
import { IDocumentFilterData } from "@/core/redux/store/reducers/filterSlice";
import { useDebounced } from "@/core/hooks/useDebounced";
import SelectedTagWidget from "@/shared/components/form/SelectTagWidget";
import { useIntl } from "react-intl";

interface IFiltersViewProps {
  onFilterChange: (filter: IDocumentFilterData) => void;
  selected_filter_data: IDocumentFilterData;
}

const FiltersView: FC<IFiltersViewProps> = ({
  selected_filter_data,
  onFilterChange,
}) => {
  const intl = useIntl();
  const { courses, subjects } = useAppSelector((state) => state.filter);
  const { user_subscribed_courses } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const searchTerm = useDebounced(value, 500);
  const handleSelectCourse = (item: ICourse) => {
    if (
      selected_filter_data.course &&
      selected_filter_data.course.id === item.id
    ) {
      onFilterChange({
        ...selected_filter_data,
        course: null,
      });
    } else {
      onFilterChange({
        ...selected_filter_data,
        course: item,
      });
    }
  };
  const handleSelectSubject = (item: ISubject) => {
    const selected_subjects_ids =
      selected_filter_data.subjects?.map((item) => item.id) || [];
    if (selected_subjects_ids.includes(item.id)) {
      const new_selected_subjects = selected_filter_data.subjects.filter(
        (subject_item) => subject_item.id !== item.id
      );
      onFilterChange({
        ...selected_filter_data,
        subjects: new_selected_subjects,
      });
    } else {
      const new_selected_subjects = [...selected_filter_data.subjects, item];
      onFilterChange({
        ...selected_filter_data,
        subjects: new_selected_subjects,
      });
    }
  };
  const handleSelectSubscribedSwitch = (state: boolean) => {
    const tmp_filter = {
      ...selected_filter_data,
    };
    if (state) {
      if (tmp_filter.subscribed) {
        delete tmp_filter.subscribed;
      } else {
        tmp_filter.subscribed = true;
      }
    } else {
      if (tmp_filter.subscribed || tmp_filter.subscribed == undefined) {
        tmp_filter.subscribed = false;
      } else {
        delete tmp_filter.subscribed;
      }
    }
    onFilterChange(tmp_filter);
  };
  const handleSearchChange = (value: string) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setValue(value);
  };
  useEffect(() => {
    onFilterChange({
      ...selected_filter_data,
      search: searchTerm,
    });
  }, [searchTerm]);
  const filtered_select_courses = useMemo(() => {
    const selected_courses_ids = selected_filter_data.course
      ? [selected_filter_data.course.id]
      : [];
    let res = courses.filter((item) => !selected_courses_ids.includes(item.id));
    if (selected_filter_data.search) {
      res = res.filter((item) =>
        item.title.includes(selected_filter_data.search)
      );
    }
    return res;
  }, [courses, selected_filter_data.search, selected_filter_data.course]);
  const filtered_select_subjects = useMemo(() => {
    const selected_subjects_ids =
      selected_filter_data.subjects?.map((item) => item.id) || [];
    let res = subjects.filter(
      (item) => !selected_subjects_ids.includes(item.id)
    );
    if (selected_filter_data.search) {
      res = res.filter((item) =>
        item.title.includes(selected_filter_data.search)
      );
    }
    return res;
  }, [subjects, selected_filter_data.search, selected_filter_data.subjects]);

  const user_subscribed_courses_ids = useMemo(() => {
    if (!user_subscribed_courses) {
      return [];
    }
    return user_subscribed_courses.map((item) => item.id);
  }, [user_subscribed_courses]);

  return (
    <div>
      <SearchInput
        value={value}
        onChange={handleSearchChange}
        onFocus={() => {
          setIsOpen(true);
        }}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className={`search-result-dropdown ${isOpen ? "active" : "d-none"}`}>
        <div className="d-flex justify-content-start align-items-start flex-wrap">
          {selected_filter_data.course && (
            <div className="me-3 mb-2">
              <SelectedTagWidget
                title={
                  selected_filter_data.course.title +
                  (user_subscribed_courses_ids.includes(
                    selected_filter_data.course.id
                  )
                    ? "(subscribed)"
                    : "")
                }
                active={true}
                onClick={() => handleSelectCourse(selected_filter_data.course)}
                variant={"primary"}
              />
            </div>
          )}
          {selected_filter_data.subjects?.map((item) => (
            <div key={item.id} className="me-3 mb-2">
              <SelectedTagWidget
                title={item.title}
                active={true}
                onClick={() => handleSelectSubject(item)}
                variant={"orange"}
              />
            </div>
          ))}
          {filtered_select_courses.map((item) => (
            <div key={item.id} className="me-3 mb-2">
              <SelectedTagWidget
                title={
                  item.title +
                  (user_subscribed_courses_ids.includes(item.id)
                    ? "(subscribed)"
                    : "")
                }
                onClick={() => handleSelectCourse(item)}
                variant={"primary"}
              />
            </div>
          ))}
          {filtered_select_subjects.map((item) => (
            <div key={item.id} className="me-3 mb-2">
              <SelectedTagWidget
                title={item.title}
                onClick={() => handleSelectSubject(item)}
                variant={"orange"}
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-start align-items-start flex-wrap">
          <div className="me-3 mb-2">
            <SelectedTagWidget
              title={intl.formatMessage({
                id: "MNWpkM",
                defaultMessage: "My subscriptions",
              })}
              active={selected_filter_data.subscribed}
              onClick={() => handleSelectSubscribedSwitch(true)}
              variant={"success"}
            />
          </div>
          <div className="me-3 mb-2">
            <SelectedTagWidget
              title={intl.formatMessage({
                id: "NrCboF",
                defaultMessage: "Not subscribed",
              })}
              active={
                !selected_filter_data.subscribed &&
                selected_filter_data.subscribed != undefined
              }
              onClick={() => handleSelectSubscribedSwitch(false)}
              variant={"secondary"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersView;
