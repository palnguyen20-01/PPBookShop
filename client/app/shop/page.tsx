import { ProductCard } from "./product-card";
import { SearchInput } from "./searchInput";
import { ListFilter } from "./listFilter";
import { SearchParamsContextWrapper } from "./searchParamsContext";
import { getAuthors } from "@/services/authors/services";
import { getBooks } from "@/services/books/services";
import {
  AuthorEntity,
  GPaginatedBookResponse,
} from "@/codegen/__generated__/graphql";
import { count } from "console";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page) || 1;

  const [authorList, bookList]: [
    authorList: AuthorEntity[],
    bookList: GPaginatedBookResponse
  ] = await Promise.all([
    getAuthors(),
    getBooks(page, 8, searchParams.input || ""),
  ]);
  return (
    <SearchParamsContextWrapper>
      <div className="container py-8">
        <header className="flex flex-col items-center gap-2">
          <div className="w-full basis-3/4 pb-4">
            <SearchInput />
          </div>
        </header>
        <div className="flex flex-col mt-0 space-y-3">
          <div className="grid grid-cols-12 xs:flex xs:flex-row">
            <div className="col-span-2 sticky top-[60px] hidden h-[calc(100vh-200px)] md:flex md:shrink-0 md:flex-col md:justify-between px-1 xs:w-min">
              <ListFilter authorList={authorList} />
            </div>
            <div className=" col-span-10 mt-4 w-full min-w-0 flex flex-col">
              <ProductCard
                books={bookList.records}
                pagyInfo={{
                  page: bookList.page,
                  size: bookList.size,
                  count: bookList.count,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </SearchParamsContextWrapper>
  );
}
