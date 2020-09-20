import React, { useEffect } from "react";
import "./styles.css";
import data from "./data.json";
import Dropdown from "./components/Dropdown/Dropdown.js";

const defaultPersonImage = "http://www.gravatar.com/avatar/?d=mp";
function round(value, step) {
  step || (step = 1.0);
  var inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

const Rating = (props) => {
  const { name } = props;
  const rating = round(props.rating, 0.5);
  return (
    <div>
      {Array.from(Array(5).keys()).map((a, i) => {
        if (i + 1 <= Math.floor(rating)) {
          return <i className="fa fa-star star" key={`${name}-${i}`} />;
        }
        if (rating - i === 0.5) {
          return <i className="fa fa-star-half-o star " key={`${name}-${i}`} />;
        }
        return <i className="fa fa-star-o star" key={`${name}-${i}`} />;
      })}
    </div>
  );
};

const DoctorItem = (props) => {
  const {
    avatar,
    rating,
    display_name,
    specialty,
    clinic_name,
    clinic_address,
    id,
  } = props.doctorData;

  const doctorSpeciality = `Bác sĩ ${specialty.map((s) => s.name).join(", ")}`;

  return (
    <div className="row doctor-item">
      <img alt="" src={avatar || defaultPersonImage} />
      <div className="doctor-info">
        <h4 className="doctor-name">{display_name}</h4>
        <div className="row">
          <Rating rating={rating} name={id} />
          <div className="font-color-gray">{rating} bệnh nhân</div>
        </div>
        <div>{doctorSpeciality}</div>
        <div className="clinic">
          <div className="clinic-name">{clinic_name}</div>
          <div className="clinic-addr">{clinic_address}</div>
        </div>
      </div>
    </div>
  );
};

const ENUM = {
  distance: "Khoảng cách",
  rating: "Đánh giá",
  vietnamese: "Tiếng Việt",
  english: "English",
  francais: "Francais"
};
const defaultSort = [
  { name: ENUM.distance, isSelected: true },
  { name: ENUM.rating, isSelected: false }
];
const defaultLanguageFilter = [
  { name: ENUM.vietnamese, isSelected: false, value: "vi" },
  { name: ENUM.english, isSelected: false, value: "en" },
  { name: ENUM.francais, isSelected: false, value: "fr" }
];

const Sort = (props) => {
  const { sortOption } = props;

  const updateSort = (selectedSort) => {
    let newSort = sortOption.map((sort) => {
      if (selectedSort.name === sort.name) {
        return { ...sort, isSelected: true };
      }
      return { ...sort, isSelected: false };
    });

    props.updateSort(newSort);
  };
  return (
    <>
      <div>Sắp xếp theo</div>
      <Dropdown options={sortOption} onSelect={updateSort} />
    </>
  );
};

const Filter = (props) => {
  const { filterOption, updateFilter: updateAction } = props;

  const updateFilter = (selectedFilter) => {
    let newFilter = filterOption.map((filter) => {
      if (selectedFilter.name === filter.name) {
        return { ...filter, isSelected: true };
      }
      return { ...filter, isSelected: false };
    });

    props.updateFilter(newFilter);
  };

  const onClickRemoveFilter = React.useCallback(
    (e) => {
      let newFilter = filterOption.map((filter) => {
        return { ...filter, isSelected: false };
      });

      updateAction(newFilter);
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    },
    [updateAction, filterOption]
  );

  const customToggle = React.useCallback(() => {
    const currentFilter = filterOption.find((opt) => opt.isSelected);

    return (
      <div className={`filter-opt ${currentFilter ? "active" : ""}`}>
        {currentFilter ? currentFilter.name : "Ngôn ngữ"}
        {currentFilter ? (
          <i className="fa fa-close" onClick={onClickRemoveFilter} />
        ) : (
          ""
        )}
      </div>
    );
  }, [filterOption, onClickRemoveFilter]);
  return (
    <>
      <div>Lọc kết quả</div>
      <Dropdown
        customToggle={customToggle}
        options={filterOption}
        onSelect={updateFilter}
      />
    </>
  );
};
export default function App() {
  const [doctorList, setDoctorList] = React.useState(data);
  const [sortOption, setSortOption] = React.useState(defaultSort);
  const [languageOption, setLanguageOption] = React.useState(
    defaultLanguageFilter
  );

  const doSortAndFilter = React.useCallback(() => {
    const currentSortOpt = sortOption.find((opt) => opt.isSelected);
    const currentFilter = languageOption.find((opt) => opt.isSelected);

    let newDoctorList = [...data];
    if (currentFilter) {
      newDoctorList = newDoctorList.filter((d) =>
        Array.isArray(d.language)
          ? d.language.includes(currentFilter.value)
          : d.language === currentFilter.value
      );
    }

    if (currentSortOpt) {
      if (currentSortOpt.name === ENUM.distance) {
        newDoctorList = [
          ...newDoctorList.sort((a, b) => a.distance - b.distance)
        ];
      } else if (currentSortOpt.name === ENUM.rating) {
        newDoctorList = [...newDoctorList.sort((a, b) => a.rating - b.rating)];
      }
    }

    setDoctorList(newDoctorList);
  }, [languageOption, sortOption]);

  useEffect(() => {
    doSortAndFilter();
  }, []);

  useEffect(() => {
    doSortAndFilter();
  }, [sortOption, languageOption, doSortAndFilter]);

  return (
    <div className="App">
      <h2 className="route-title">Danh sách bác sĩ</h2>

      <div className="row align-items-center sort-type">
        <Sort sortOption={sortOption} updateSort={setSortOption} />
        <Filter
          filterOption={languageOption}
          updateFilter={setLanguageOption}
        />
      </div>
      {doctorList.map((doctor) => (
        <DoctorItem key={doctor.id} doctorData={doctor} />
      ))}
    </div>
  );
}
