export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const dataTable: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  {
    id: "x9pl2kq7",
    amount: 450,
    status: "success",
    email: "johndoe@example.com",
  },
  {
    id: "w3n8zv6y",
    amount: 123,
    status: "failed",
    email: "janedoe@example.com",
  },
  {
    id: "t7q4m1x9",
    amount: 678,
    status: "processing",
    email: "alice@example.com",
  },
  {
    id: "v5r2k8m3",
    amount: 910,
    status: "success",
    email: "bob@example.com",
  },
  {
    id: "y2n6x4q8",
    amount: 345,
    status: "failed",
    email: "charlie@example.com",
  },
  {
    id: "z8m3k5r2",
    amount: 789,
    status: "processing",
    email: "dave@example.com",
  },
  {
    id: "p4q7x9m1",
    amount: 234,
    status: "success",
    email: "eve@example.com",
  },
  {
    id: "k9m2r5x8",
    amount: 567,
    status: "failed",
    email: "frank@example.com",
  },
  {
    id: "q8x4m7r2",
    amount: 890,
    status: "processing",
    email: "grace@example.com",
  },
  {
    id: "m1r5k9x2",
    amount: 432,
    status: "success",
    email: "hank@example.com",
  },
];
