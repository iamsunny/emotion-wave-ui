
import React from "react";
import { Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock data for the dashboard sections where we don't have real data yet
const churnRiskData = [
  {
    id: "EMP-001",
    riskLevel: "High",
    suggestedAction: "Schedule 1:1 conversation",
    lastCheckIn: "3 days ago",
  },
  {
    id: "EMP-023",
    riskLevel: "Medium",
    suggestedAction: "Recommend team bonding",
    lastCheckIn: "Yesterday",
  },
  {
    id: "EMP-047",
    riskLevel: "Medium",
    suggestedAction: "Check work-life balance",
    lastCheckIn: "Today",
  },
  {
    id: "EMP-112",
    riskLevel: "Low",
    suggestedAction: "Continue monitoring",
    lastCheckIn: "Today",
  },
  {
    id: "EMP-089",
    riskLevel: "High",
    suggestedAction: "Initiate wellness check",
    lastCheckIn: "5 days ago",
  },
];

const ChurnRiskTable = () => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead className="hidden sm:table-cell">Last Check-In</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {churnRiskData.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={
                    employee.riskLevel === "High" 
                      ? "bg-red-100 text-red-800 border-red-200" 
                      : employee.riskLevel === "Medium" 
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                        : "bg-green-100 text-green-800 border-green-200"
                  }
                >
                  {employee.riskLevel}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{employee.lastCheckIn}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Info className="h-3.5 w-3.5 mr-1" />
                  Take Action
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ChurnRiskTable;
