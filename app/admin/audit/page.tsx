"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Activity, Database, Users, Clock, TestTube } from "lucide-react";

interface AuditLog {
  id: number;
  timestamp: string;
  usuario: string;
  tabla: string;
  accion: string;
  record_id: number;
  datos: any;
}

interface AuditStatus {
  status: string;
  total_logs: number;
  logs_24_horas: number;
  cobertura_tablas: string;
  tablas_auditadas: string[];
  logs_por_tabla: Array<{ table_name: string; count: number }>;
  logs_por_tipo: Array<{ change_type: string; count: number }>;
  ultimos_logs: any[];
}

export default function AuditPage() {
  const [auditStatus, setAuditStatus] = useState<AuditStatus | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchAuditStatus = async () => {
    try {
      const response = await fetch('/api/audit/status/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAuditStatus(data);
      }
    } catch (error) {
      console.error('Error fetching audit status:', error);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch('/api/audit/logs/?limit=10', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRecentLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching recent logs:', error);
    }
  };

  const testTriggers = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/audit/test/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      setTestResult(result);
      
      // Refrescar datos después del test
      if (result.status === 'success') {
        await fetchAuditStatus();
        await fetchRecentLogs();
      }
    } catch (error) {
      console.error('Error testing triggers:', error);
      setTestResult({
        status: 'error',
        message: 'Error de conexión al probar triggers'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAuditStatus(), fetchRecentLogs()]);
      setLoading(false);
    };
    
    loadData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchAuditStatus();
      fetchRecentLogs();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'conferencias': return '🎤';
      case 'integrantes': return '👥';
      case 'noticias': return '📰';
      case 'cursos': return '📚';
      case 'ofertasempleo': return '💼';
      case 'proyectos': return '🚀';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando datos de auditoría...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Auditoría</h1>
          <p className="text-gray-600">Monitor y verificación del sistema de auditoría</p>
        </div>
        <Button 
          onClick={testTriggers} 
          disabled={testing}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          {testing ? 'Probando...' : 'Probar Triggers'}
        </Button>
      </div>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {auditStatus?.status === 'operational' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-lg font-bold">
                {auditStatus?.status === 'operational' ? 'Operativo' : 'Inactivo'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStatus?.total_logs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimas 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStatus?.logs_24_horas || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura de Tablas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStatus?.cobertura_tablas || '0%'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Resultado del Test */}
      {testResult && (
        <Alert className={testResult.status === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription>
            <div className="flex items-center gap-2">
              {testResult.status === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>{testResult.message}</span>
            </div>
            {testResult.status === 'success' && (
              <div className="mt-2 text-sm">
                <p>Logs antes: {testResult.logs_before} → después: {testResult.logs_after} → final: {testResult.logs_final}</p>
                <p>Triggers probados: {testResult.triggers_tested?.join(', ')}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs Recientes</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="tables">Por Tabla</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Registros de Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getTableIcon(log.tabla)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getActionColor(log.accion)}>
                              {log.accion}
                            </Badge>
                            <span className="font-medium">{log.tabla}</span>
                            <span className="text-sm text-gray-500">#{log.record_id}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            por {log.usuario} • {log.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay logs recientes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Por Tipo de Operación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditStatus?.logs_por_tipo.map((item) => (
                    <div key={item.change_type} className="flex justify-between items-center">
                      <Badge className={getActionColor(item.change_type)}>
                        {item.change_type}
                      </Badge>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tablas Auditadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditStatus?.tablas_auditadas.map((table) => (
                    <div key={table} className="flex items-center space-x-2">
                      <span>{getTableIcon(table.replace('blog_', ''))}</span>
                      <span>{table.replace('blog_', '')}</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros por Tabla</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditStatus?.logs_por_tabla.map((item) => (
                  <div key={item.table_name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTableIcon(item.table_name.replace('blog_', ''))}</span>
                      <span className="font-medium">{item.table_name.replace('blog_', '')}</span>
                    </div>
                    <Badge variant="outline">{item.count} registros</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 