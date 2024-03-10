import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BaseHttpService {
  constructor(private http: HttpClient) {}

  getSimple(url: string, filters?: any) {
    return this.http.get(url, {
      params: {
        ...filters,
      },
    });
  }
  get<T>(url: string, filters?: any): Observable<any> {
    return this.http
      .get(url, {
        params: {
          ...filters,
        },
      })
      .pipe(
        map((data: any) => {
          const data_results = data.results || [];
          const data_total_items = data.count || 0;
          return {
            results: data_results.map(function (data_results: any): T {
              return {
                ...data_results,
              } as T;
            }),
            count: data_total_items,
          };
        })
      );
  }
  detail<T>(url: string, filters?: any): Observable<any> {
    return this.http
      .get(url, {
        params: {
          ...filters,
        },
      })
      .pipe(
        map((data: any) => {
          return { ...data } as T;
        })
      );
  }
  post<T>(url: string, data: any): Observable<any> {
    return this.http.post(url, data).pipe(
      map((data: any) => {
        return { ...data } as T;
      })
    );
  }
  patch<T>(url: string, data: any): Observable<any> {
    return this.http.patch(url, data).pipe(
      map((data: any) => {
        return { ...data } as T;
      })
    );
  }
  delete(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
