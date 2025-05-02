
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const topEmployees = [
  {
    name: "Alex P.",
    avatar: "/placeholder.svg",
    xpPoints: 1250,
    moodConsistency: "85% happy",
  },
  {
    name: "Jamie R.",
    avatar: "/placeholder.svg",
    xpPoints: 980,
    moodConsistency: "72% happy",
  },
  {
    name: "Taylor S.",
    avatar: "/placeholder.svg",
    xpPoints: 870,
    moodConsistency: "68% calm",
  },
  {
    name: "Casey K.",
    avatar: "/placeholder.svg",
    xpPoints: 750,
    moodConsistency: "63% focused",
  },
];

const EngagedEmployeesTable = () => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>XP Points</TableHead>
            <TableHead className="hidden sm:table-cell">Mood Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topEmployees.map((employee) => (
            <TableRow key={employee.name}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{employee.name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.xpPoints}</TableCell>
              <TableCell className="hidden sm:table-cell">{employee.moodConsistency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default EngagedEmployeesTable;
