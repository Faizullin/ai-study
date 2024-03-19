interface ICourseStorageConstantData {
  courses;
}

export const CourseStorageConstantKeys: ICourseStorageConstantData = {
  courses: "courses",
};

export default class CourseStorageService {
  public static clean(): void {
    Object.values(CourseStorageConstantKeys).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
  public static getStorageData(): Object {
    const data = {};
    Object.values(CourseStorageConstantKeys).forEach((key) => {
      data[key] = localStorage.getItem(key) || null;
    });
    return data;
  }
  public static setStorageData(data: ICourseStorageConstantData) {
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key, data[key]);
    });
    return data;
  }
}
