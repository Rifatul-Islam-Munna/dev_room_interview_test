"use client";

import { useState, FormEvent, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Loader2,
  Save,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const client = hc<AppType>("/api");

interface Purchase {
  _id: string;
  name: string;
  description: string;
  amount: number;
  isCyclic: boolean;
  date: string;
  balanceBefore: number;
  balanceAfter: number;
}

export default function EditPurchasePage() {
  const router = useRouter();
  const params = useParams();
  const purchaseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isCyclic, setIsCyclic] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [balanceBefore, setBalanceBefore] = useState("");
  const [balanceAfter, setBalanceAfter] = useState("");

  useEffect(() => {
    fetchPurchase();
  }, [purchaseId]);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const response = await client.purchases[":id"].$get({
        param: { id: purchaseId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch purchase");
      }

      const data = await response.json();
      const purchase = data.purchase as Purchase;

      setName(purchase.name);
      setDescription(purchase.description);
      setAmount(purchase.amount.toString());
      setIsCyclic(purchase.isCyclic);
      setDate(new Date(purchase.date));
      setBalanceBefore(purchase.balanceBefore.toString());
      setBalanceAfter(purchase.balanceAfter.toString());
    } catch (error) {
      console.error("Error fetching purchase:", error);
      toast.error("Failed to load purchase");
      router.push("/purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateBalance = () => {
    const amountNum = Number(amount) || 0;
    const balanceBeforeNum = Number(balanceBefore) || 0;
    const result = balanceBeforeNum - amountNum;
    setBalanceAfter(result.toString());
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!amount || Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!balanceBefore) newErrors.balanceBefore = "Balance before is required";
    if (!balanceAfter) newErrors.balanceAfter = "Balance after is required";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await client.purchases[":id"].$patch({
        param: { id: purchaseId },
        json: {
          name: name.trim(),
          description: description.trim(),
          amount: Number(amount),
          isCyclic: isCyclic,
          date: date.toISOString(),
          balanceBefore: Number(balanceBefore),
          balanceAfter: Number(balanceAfter),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          (errorData as any).error || "Failed to update purchase",
        );
      }

      toast.success("Purchase updated successfully!");
      router.push("/dashboard/purchases");
      router.refresh();
    } catch (error) {
      console.error("Error updating purchase:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update purchase",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
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
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/purchases">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Edit Purchase
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Update your expense details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
          <CardDescription>
            Modify the information about your purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Netflix Subscription"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  A short name for this purchase
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn(
                      "pl-9",
                      errors.amount ? "border-destructive" : "",
                    )}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={handleCalculateBalance}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Purchase amount in USD
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Monthly streaming service subscription"
                className={cn(
                  "resize-none",
                  errors.description ? "border-destructive" : "",
                )}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Detailed description of the purchase
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-destructive",
                      )}
                      disabled={isSubmitting}
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  When did this purchase occur?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isCyclic">Recurring Purchase</Label>
                <div className="flex items-center space-x-2 h-10">
                  <input
                    id="isCyclic"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={isCyclic}
                    onChange={(e) => setIsCyclic(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="isCyclic"
                    className="font-normal cursor-pointer"
                  >
                    This is a recurring expense
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mark if this repeats monthly (e.g., subscriptions)
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="balanceBefore">
                  Balance Before <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="balanceBefore"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn(
                      "pl-9",
                      errors.balanceBefore ? "border-destructive" : "",
                    )}
                    value={balanceBefore}
                    onChange={(e) => setBalanceBefore(e.target.value)}
                    onBlur={handleCalculateBalance}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.balanceBefore && (
                  <p className="text-sm text-destructive">
                    {errors.balanceBefore}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Your balance before this purchase
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balanceAfter">
                  Balance After <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="balanceAfter"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn(
                      "pl-9 bg-muted",
                      errors.balanceAfter ? "border-destructive" : "",
                    )}
                    value={balanceAfter}
                    onChange={(e) => setBalanceAfter(e.target.value)}
                    disabled={isSubmitting}
                    readOnly
                  />
                </div>
                {errors.balanceAfter && (
                  <p className="text-sm text-destructive">
                    {errors.balanceAfter}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Automatically calculated from balance before - amount
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Link href="/purchases" className="flex-1 sm:flex-initial">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Purchase
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
