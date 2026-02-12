"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Plus,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const client = hc<AppType>("/api");

interface Category {
  _id: string;
  name: string;
  type: string;
}

interface Income {
  _id: string;
  amount: number;
  category: string;
  date: string;
}

export default function EditIncomePage() {
  const router = useRouter();
  const params = useParams();
  const incomeId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingIncome, setFetchingIncome] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Errors
  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});

  useEffect(() => {
    fetchIncome();
    fetchCategories();
  }, [incomeId]);

  const fetchIncome = async () => {
    try {
      setFetchingIncome(true);
      const res = await client.income[":id"].$get({
        param: { id: incomeId },
      });
      console.log("res", res);

      if (res.ok) {
        const data = await res.json();
        const income = data.income as Income;
        setAmount(income.amount.toString());
        setCategory(income.category);
        setDate(new Date(income.date));
      } else {
        toast.error("Failed to load income data");
      }
    } catch (error) {
      console.error("Failed to fetch income:", error);
      toast.error("Failed to load income data");
    } finally {
      setFetchingIncome(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await client.categories.$get({
        query: { type: "income" },
      });
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setCreatingCategory(true);
      const res = await client.categories.$post({
        json: {
          name: newCategoryName.trim(),
          type: "income",
        },
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Category created successfully");
        setCategories((prev) => [...prev, data.category]);
        setCategory(data.category.name);
        setNewCategoryName("");
        setNewCategoryDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await client.income[":id"].$patch({
        param: { id: incomeId },
        json: {
          amount: parseFloat(amount),
          category: category,
          date: date.toISOString(),
        },
      });

      if (res.ok) {
        toast.success("Income updated successfully");
        router.push("/dashboard/income");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update income");
      }
    } catch (error) {
      console.error("Failed to update income:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingIncome) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/income">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Edit Income
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Update your income entry
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Details</CardTitle>
          <CardDescription>
            Update the information below to modify your income entry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) {
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                    }
                  }}
                  className={cn("pl-7", errors.amount && "border-destructive")}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }
                  }}
                  disabled={loadingCategories}
                >
                  <SelectTrigger
                    className={cn(
                      "flex-1",
                      errors.category && "border-destructive",
                    )}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No categories yet
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Dialog
                  open={newCategoryDialogOpen}
                  onOpenChange={setNewCategoryDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                      <DialogDescription>
                        Add a new income category to organize your entries
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-category">Category Name</Label>
                        <Input
                          id="new-category"
                          placeholder="e.g., Freelance, Salary, Investment"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleCreateCategory();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setNewCategoryDialogOpen(false);
                          setNewCategoryName("");
                        }}
                        disabled={creatingCategory}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategoryName.trim()}
                      >
                        {creatingCategory && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Link href="/dashboard/income" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Income
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
